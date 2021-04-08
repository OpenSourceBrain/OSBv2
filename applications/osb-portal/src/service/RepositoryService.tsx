

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace, OSBRepository } from '../apiclient/workspaces';



const workspacesApiUri = '/api/workspaces/api';

class RepositoryService {

  workspacesApi: RestApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getRepositories(page: number): Promise<OSBRepository[]> {
    return [];
  }

  async getRepository(id: number): Promise<OSBRepository> {
    return null;
  }
}




export default new RepositoryService();
