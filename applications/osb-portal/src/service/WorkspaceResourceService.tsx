import { WorkspaceresourceIdGetRequest, WorkspacesControllerWorkspaceResourceOpenRequest } from "../apiclient/workspaces/apis/RestApi";

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, WorkspaceResource as ApiWorkspaceResource } from '../apiclient/workspaces';
const workspacesApiUri = '/api/workspaces/api';

class WorkspaceResourceService {
  workspacesApi: RestApi = null;
  initApis = (token: string) => {
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspaceResource(id: number): Promise<ApiWorkspaceResource> {
    const wsrigr: WorkspaceresourceIdGetRequest = { id };
    let result: ApiWorkspaceResource = null;
    await this.workspacesApi.workspaceresourceIdGet(wsrigr).then((workspaceresource: ApiWorkspaceResource) => {
      result = workspaceresource;
    });
    return result;
  }

  async workspacesControllerWorkspaceResourceOpen(id: number): Promise<void> {
      const wsrogr: WorkspacesControllerWorkspaceResourceOpenRequest = { id };
      await this.workspacesApi.workspacesControllerWorkspaceResourceOpen(wsrogr).then(() => {
        //
      });
  }
}

export default new WorkspaceResourceService();
