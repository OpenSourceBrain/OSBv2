

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace, OSBRepository, RepositoryContentType, RepositoryType } from '../apiclient/workspaces';



const workspacesApiUri = '/proxy/workspaces/api';

const PER_PAGE_DEFAULT = 10;

class RepositoryService {

  workspacesApi: RestApi = null;
  accessToken: string = null;

  EMPTY_REPOSITORY: OSBRepository = {
    uri: '',
    name: '',
    defaultContext: '',
    contentTypesList: [] as RepositoryContentType[],
    summary: '',
    repositoryType: RepositoryType.Github,
    contentTypes: null,
    autoSync: true
  }

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getRepositories(page: number, size = PER_PAGE_DEFAULT): Promise<OSBRepository[]> {
    return (await this.workspacesApi.osbrepositoryGet({ page, perPage: size })).osbrepositories;
  }

  async getUserRepositories(userId: string, page: number, size = PER_PAGE_DEFAULT): Promise<OSBRepository[]> {
    return (await this.workspacesApi.osbrepositoryGet({ page, perPage: size, q: `user_id=${userId}` })).osbrepositories;
  }


  async getRepository(id: number): Promise<OSBRepository> {
    return this.workspacesApi.osbrepositoryIdGet({ id });
  }

  async addRepository(repository: OSBRepository) {
    repository.contentTypes = repository.contentTypesList.join(',');
    repository.autoSync = Boolean(repository.autoSync);
    return this.workspacesApi.osbrepositoryPost({ oSBRepository: repository });
  }
}




export default new RepositoryService();
