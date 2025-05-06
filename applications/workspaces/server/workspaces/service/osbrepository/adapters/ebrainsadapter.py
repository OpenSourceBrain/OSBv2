import re
import sys
from typing import List, Optional
import requests
from functools import cache, cached_property


from fairgraph import KGClient, KGProxy, KGQuery
from fairgraph.errors import ResolutionFailure
from fairgraph.openminds.core import FileRepository, Model, ModelVersion
from cloudharness import log as logger
from cloudharness.utils.secrets import get_secret
from workspaces.models import RepositoryResourceNode, RepositoryInfo
from workspaces.models.resource_origin import ResourceOrigin
from workspaces.models.ebrains_repository_resource import EBRAINSRepositoryResource

from .utils import add_to_tree
from .githubadapter import GitHubAdapter


class EBRAINSException(Exception):
    pass


class EBRAINSAdapter:
    """
    Adapter for EBRAINS

    https://search.kg.ebrains.eu/
    """

    def __init__(self, osbrepository, uri=None):
        self.osbrepository = osbrepository
        self.uri = uri if uri else osbrepository.uri
        self.api_url = "https://search.kg.ebrains.eu"

        # TODO: get permanent application auth token from EBRAINS
        try:
            kg_client = get_secret("ebrains-user")
        except:
            kg_client = None
        try:
            kg_secret = get_secret("ebrains-secret")
        except:
            kg_secret = None
        if kg_user and kg_secret:
            self.kg_client = KGClient(client_id=kg_client, client_secret=kg_secret, host="core.kg.ebrains.eu")
        else:
            token = ""
            self.kg_client = KGClient(token=token, host="core.kg.ebrains.eu")

        if not self.kg_client:
            raise EBRAINSException("Could not initialise EBRAINS KG client")

        try:
            self.model_id = re.search(
                f"{self.api_url}/instances/([\\w-]+)",
                self.uri.strip("/")).group(1)

        except AttributeError:
            raise EBRAINSException(f"{uri} is not a valid EBRAINS URL")

    @cache
    def get_model(self, uri: Optional[str] = None) -> Model:
        """Get model object using FairGraph

        This returns the main model, not the ModelVersion. If a ModelVersion URL is
        passed, it finds the URL of the Model and returns that.
        """
        logger.debug(f"Getting: {self.model_id}")
        # if it's a Model
        try:
            model: Model = Model.from_id(id=self.model_id, client=self.kg_client)
        # if it's a ModelVersion
        except TypeError:
            model_version: ModelVersion = ModelVersion.from_id(id=self.model_id, client=self.kg_client)
            model_query: KGQuery = model_version.is_version_of
            model = model_query.resolve(self.kg_client)

        if not model:
            raise EBRAINSException("Could not fetch EBRAINS model")

        return model

    def get_base_uri(self):
        return self.uri

    @cache
    def get_info(self) -> RepositoryInfo:
        """Get repository metadata from model object"""
        model = self.get_model()
        return RepositoryInfo(name=model.name, contexts=self.get_contexts(), tags=self.get_tags("foobar"), summary=self.get_description())

    def _get_keywords(self) -> list[str]:
        """Get keywords from model

        :returns: list of keywords

        """
        model = self.get_model()
        keywords: list[str] = []
        if model.study_targets:
            if isinstance(model.study_targets, KGProxy):
                keyws = model.study_targets.resolve(self.kg_client)
            else:
                keyws = model.study_targets

            if isinstance(keyws, list):
                for k in keyws:
                    if isinstance(k, KGProxy):
                        try:
                            keywords.append(k.resolve(self.kg_client).name)
                        except ResolutionFailure:
                            pass
                    else:
                        keywords.append(k.name)
            else:
                if isinstance(keyws, KGProxy):
                    keywords.append(keyws.resolve().name)
                else:
                    keywords.append(keyws.name)

        if model.abstraction_level:
            if isinstance(model.abstraction_level, KGProxy):
                abs_l = model.abstraction_level.resolve(self.kg_client)
            else:
                abs_l = model.abstraction_level
            keywords.append(abs_l.name)

        return keywords

    @cache
    def get_contexts(self) -> list[str]:
        model = self.get_model()
        if isinstance(model.versions, list):
            versions = model.versions
        else:
            versions = [model.versions]

        contexts = []

        for v in versions:
            v_r: Optional[ModelVersion] = None
            if isinstance(v, KGProxy):
                try:
                    v_r = v.resolve(self.kg_client)
                except ResolutionFailure:
                    logger.error(f"ERROR: Could not resolve {v.id}")
                    continue
            else:
                v_r = v

            if v_r:
                contexts.append(v_r.version_identifier)

        return contexts

    def _get_file_storage_url(self, context: str) -> Optional[str]:
        """Get the URL of the file storage for the provided context

        :param context: TODO
        :returns: TODO

        """
        model = self.get_model()
        if isinstance(model.versions, list):
            versions = model.versions
        else:
            versions = [model.versions]

        for v in versions:
            v_r: Optional[ModelVersion] = None
            if isinstance(v, KGProxy):
                try:
                    v_r = v.resolve(self.kg_client)
                except ResolutionFailure:
                    logger.error(f"ERROR: Could not resolve {v.id}")
                    continue
            else:
                v_r = v
            if v_r:
                if context == v_r.version_identifier:
                    repository: FileRepository = v_r.repository
                    try:
                        repository_r = repository.resolve(self.kg_client)
                        return repository_r.name
                    except ResolutionFailure:
                        logger.error(f"Could not resolve {repository.id}")

        return None


    def _get_ebrains_data_proxy_file_list(self, url: str) -> dict[str, str]:
        """Get the list of files from an ebrains data proxy URL.

        The complete url will be of this form:

        .. code-block::

            https://data-proxy.ebrains.eu/api/v1/buckets/m-0ffae3c2-443c-44fd-919f-70a4b01506a4?prefix=CA1_pyr_mpg150211_A_idA_080220241322/

        The API documentation is here:
        https://data-proxy.ebrains.eu/api/docs

        This URL returns a JSON response with all the objects listed.
        So we can get the file list from there. To get the download URL, we need
        this end point for each object in the list:

        .. code-block::

            /v1/buckets/{bucket_name}/{object_name}

        :param url: url of repository
        :returns: dict of files and their download URLs

        """
        file_list: dict[str, str] = {}
        top_level_url: str = url.split("?prefix=")[0]

        r = requests.get(url)
        if r.status_code == 200:
            logger.debug("data-proxy: response is")
            logger.debug(r)

            json_r = r.json()
            object_list = json_r["objects"]
            for anobject in object_list:
                object_url = top_level_url + "/" + anobject["name"]
                file_list[anobject["name"]] = object_url

        else:
            logger.error(f"Something went wrong: {r.response_code}")

        if len(file_list.items()) == 0:
            logger.warn("No files found for this: check kg.ebrains.eu to verify")

        return file_list


    def _get_cscs_file_list(self, url: str) -> dict[str, str]:
        """Get the list of files from a CSCS repository URL.

        The complete url will be of this form:

        .. code-block:

            https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/hippocampus_optimization/rat/CA1/v4.0.5/optimizations_Python3/CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006/CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006.zip?use_cell=cell_seed3_0.hoc&bluenaas=true

        To get the file list, we only need the top level:

        .. code-block::

            https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/hippocampus_optimization

        We then need to limit the file list to the bits we want, because the top
        level container contains all the files and all the versions:

        .. code-block::

            rat/CA1/v4.0.5/optimizations_Python3/CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006/CA1_pyr_cACpyr_mpg141208_B_idA_20190328144006

        Note that even if the url is wrong (eg, in the shown example, the file list
        does not include a folder called `optimizations_Python3` at all), the cscs
        server still returns a zip. However, manually checking search.kg.ebrains.eu
        shows that the corresponding entry does not have a file list. It simply
        says "no files available".

        Also note that the url may include a `prefix=` parameter which specifies
        the file directory structure.

        Most of these directories also include a zipped version. For the moment, we
        include this in the file list.

        :param url: url of repository
        :returns: dict of files and their download URLs

        """
        file_list: dict[str, str] = {}
        file_list_url: str = ""
        file_list_string: str = ""

        special_suffixes = [
            "py",
            "hoc",
            "xz",
            "zip",
            "pkl",
            "json",
            "pdf",
            "mod",
            "txt",
            "png",
            "zip",
            "ipynb",
        ]
        # if prefixed by data.kg, get rid of it so that we have only the cscs URL
        new_url = url.replace("https://data.kg.ebrains.eu/zip?container=", "")

        logger.debug(f"Getting file list for {new_url}")
        # default
        url_portions: list[str] = new_url.split("/")
        file_list_url = "/".join(url_portions[:6])
        file_list_string = "/".join(url_portions[6:])

        # special cases
        if ".zip?" in new_url:
            logger.debug(f"Cscs url format with zip: {new_url}")
            url_portions: list[str] = new_url.split(".zip")[0].split("/")
            file_list_url = "/".join(url_portions[:6])
            file_list_string = "/".join(url_portions[6:])
        elif "?prefix=" in new_url:
            logger.debug(f"Cscs url format with prefix: {new_url}")
            file_list_url = new_url.split("?prefix=")[0]
            file_list_string = new_url.split("?prefix=")[1]
        else:
            # handle single files:
            # it is possible that they provide zip URLs but all the files are also
            # individually available. there's no way for us to know that the whole file list
            # is also available, though, so we simply provide the zip URL too.
            logger.debug(f"Other cscs url format: {new_url}")
            for suf in special_suffixes:
                if new_url.endswith(suf):
                    file_list = {file_list_string: new_url}
                    return file_list

        # handle file lists
        r = requests.get(file_list_url)
        if r.status_code == 200:
            for line in r.text.split():
                if (
                    line.startswith(file_list_string)
                    and not line.endswith("/")
                    and line != file_list_string
                ):
                    file_list[line] = file_list_url + "/" + line
        else:
            logger.error(f"Something went wrong: {r.response_code}")

        if len(file_list) == 0:
            logger.warn("No files found for this: check kg.ebrains.eu to verify")
        return file_list


    def get_resources(self, context):
        logger.debug(f"Getting resources: {context}")

        download_url = self._get_file_storage_url(context)
        if "github" in download_url.lower():
            logger.debug("GITHUB resource")
            # these may have things like "tree" in them, we only want github.com/user/repository
            github_url_parts = download_url.split("/")
            github_url = "/".join(github_url_parts[:5])
            gh_adapter = GitHubAdapter(self.osbrepository, github_url)
            return gh_adapter.get_resources(context)

        elif "modeldb" in download_url.lower():
            logger.debug("Modeldb resource")
            model_id = ""
            # urls with model id after the last slash
            # https://modeldb.science/249408?tab=7
            if "modeldb.science" in download_url or "modeldb.yale.edu" in download_url:
                model_id = download_url.split("/")[-1].split('?')[0]
            # legacy urls with model id as a parameter
            # https://senselab.med.yale.edu/ModelDB/showmodel.cshtml?model=249408#tabs-1
            else:
                model_id = download_url.split("?model=")[-1].split('#')[0]

            modeldb_url = f"https://github.com/ModelDBRepository/{model_id}"
            gh_adapter = GitHubAdapter(self.osbrepository, modeldb_url)
            # versions on EBRAINS do not match the versions on ModelDB/GitHub
            # so we use the first context
            contexts = gh_adapter.get_contexts()
            return gh_adapter.get_resources(contexts[0])

        elif "cscs.ch" in download_url:
            logger.debug("CSCS resource")
            files = self._get_cscs_file_list(download_url)
        elif "data-proxy.ebrains.eu" in download_url:
            logger.debug("Data-proxy resource")
            files = self._get_ebrains_data_proxy_file_list(download_url)
        else:
            files = ["TODO: handle other special cases"]

        logger.debug(f"Files are: {files}")

        tree = RepositoryResourceNode(
            resource=EBRAINSRepositoryResource(
                name="/",
                path="/",
                osbrepository_id=self.osbrepository.id,
                ref=context,
            ),
            children=[],
        )

        for afile, url in files.items():
            add_to_tree(
                tree=tree,
                tree_path=afile.split("/"),
                path=url,
                osbrepository_id=self.osbrepository.id,
            )

        return tree

    def get_description(self, context: str = "foobar"):
        logger.debug(f"Getting description: {context}")
        try:
            result = self.get_model()
            return result.description
        except Exception as e:
            logger.debug(
                "unable to get the description from biomodels, %", str(e))
            return ""

    def get_tags(self, context):
        # all versions have same tags for EBRAINS, so we pass any rubbish to the argument
        logger.debug(f"Getting tags: {context}")
        return self._get_keywords()

    def create_copy_task(self, workspace_id, origins: List[ResourceOrigin]):
        import workspaces.service.workflow as workflow

        # no file tree in EBRAINS from the looks of it
        folder = self.osbrepository.name

        download_url = self._get_file_storage_url(self.osbrepository.default_context)
        if "github" in download_url:
            # these may have things like "tree" in them, we only want github.com/user/repository
            github_url_parts = download_url.split("/")
            github_url = "/".join(github_url_parts[:5])
            gh_adapter = GitHubAdapter(self.osbrepository, uri=github_url)
            return gh_adapter.create_copy_task(workspace_id, origins)

        elif "modeldb" in download_url.lower():
            model_id = ""
            # urls with model id after the last slash
            # https://modeldb.science/249408?tab=7
            if "modeldb.science" in download_url or "modeldb.yale.edu" in download_url:
                model_id = download_url.split("/")[-1].split('?')[0]
            # legacy urls with model id as a parameter
            # https://senselab.med.yale.edu/ModelDB/showmodel.cshtml?model=249408#tabs-1
            else:
                model_id = download_url.split("?model=")[-1].split('#')[0]

            modeldb_url = f"https://github.com/ModelDBRepository/{model_id}"
            gh_adapter = GitHubAdapter(self.osbrepository, modeldb_url)
            return gh_adapter.create_copy_task(workspace_id, origins)

        # if nothing is selected, origins has one entry with path "/"
        # we get the file list and download individual files
        if len(origins) == 1 and origins[0].path == "/":
            files: dict[str, str] = {}
            if "cscs.ch" in download_url:
                files = self._get_cscs_file_list(download_url)
            elif "data-proxy.ebrains.eu" in download_url:
                files = self._get_ebrains_data_proxy_file_list(download_url)

            paths = "\\".join(list(files.values()))
        else:
            paths = "\\".join(o.path for o in origins)

        # username / password are not currently used
        return workflow.create_copy_task(
            image_name="workspaces-ebrains-copy",
            workspace_id=workspace_id,
            folder=folder,
            url=f"{self.model_id}.{self.osbrepository.default_context}",
            paths=paths,
            username="",
            password="",
        )
