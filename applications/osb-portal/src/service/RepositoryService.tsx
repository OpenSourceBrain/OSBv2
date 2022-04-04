import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace, OSBRepository, RepositoryContentType, RepositoryType, InlineResponse2001, InlineResponse2003, OsbrepositoryIdPutRequest } from '../apiclient/workspaces';
import SearchFilter from '../types/searchFilter';

type RepositoriesListAndPaginationDetails = InlineResponse2001;

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

  async getRepositories(page: number, size = PER_PAGE_DEFAULT, userId: string = null): Promise<OSBRepository[]> {
    return (await this.workspacesApi.osbrepositoryGet({ page, perPage: size, userId })).osbrepositories;
  }

  async getRepositoriesByFilter(page: number, filter: SearchFilter, size = PER_PAGE_DEFAULT): Promise<RepositoriesListAndPaginationDetails> {

    const nameAndSummaryQuery = !filter.text ? '' : `name__like=%${filter.text}%+summary__like=%${filter.text}%`;
    const tags = filter.tags && filter.tags.length > 0 ? `${filter.tags.join('+')}` : '';
    const types = filter.tags && filter.types.length > 0 ? `${filter.types.join('+')}` : '';


    return (this.workspacesApi.osbrepositoryGet(
      {
        page,
        q: nameAndSummaryQuery,
        perPage: size,
        tags,
        types
      }));
  }

  async getRepositoriesDetails(page: number, size = PER_PAGE_DEFAULT): Promise<RepositoriesListAndPaginationDetails> {
    return (this.workspacesApi.osbrepositoryGet({ page, perPage: size }));
  }

  async getUserRepositories(userId: string, page: number, size = PER_PAGE_DEFAULT): Promise<OSBRepository[]> {
    return (await this.workspacesApi.osbrepositoryGet({ page, perPage: size, q: `user_id=${userId}` })).osbrepositories;
  }

  async getUserRepositoriesDetails(userId: string, page: number, size = PER_PAGE_DEFAULT): Promise<RepositoriesListAndPaginationDetails> {
    return (this.workspacesApi.osbrepositoryGet({ page, perPage: size, q: `user_id=${userId}` }));
  }

  async getRepository(id: number): Promise<OSBRepository> {
    return this.workspacesApi.osbrepositoryIdGet({ id });
  }

  async getRepositoryContext(uri: string, repositoryType: RepositoryType): Promise<string[]> {
    return this.workspacesApi.getContexts({ uri, repositoryType });
  }

  async getRepositoryKeywords(uri: string, repositoryType: RepositoryType, context: string): Promise<string[]> {
    return this.workspacesApi.getKeywords({ uri, repositoryType, context });
  }

  async getRepositoryDescription(uri: string, repositoryType: RepositoryType, context: string): Promise<string> {
    return this.workspacesApi.getDescription({ uri, repositoryType, context });
  }

  async addRepository(repository: OSBRepository) {
    repository.contentTypes = repository.contentTypesList.join(',');
    repository.autoSync = Boolean(repository.autoSync);
    return this.workspacesApi.osbrepositoryPost({ oSBRepository: repository });
  }

  async updateRepository(repository: OSBRepository): Promise<OSBRepository> {
    delete repository.timestampCreated;
    delete repository.timestampModified;
    delete repository.timestampUpdated;
    delete repository.contexts;
    delete repository.contextResources;
    delete repository.autoSync;
    const requestParameters: OsbrepositoryIdPutRequest = { id: repository.id, oSBRepository: repository };
    return this.workspacesApi.osbrepositoryIdPut(requestParameters);
  }

  async getAllTags(page?: number, perPage?: number, q?: string): Promise<InlineResponse2003> {
    const requestParameters = { page, perPage, q };
    return this.workspacesApi.tagGet(requestParameters);
  }
}




export default new RepositoryService();
