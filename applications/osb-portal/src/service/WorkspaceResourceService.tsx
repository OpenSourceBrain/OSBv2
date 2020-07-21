import { WorkspaceresourceIdGetRequest, WorkspacesControllerWorkspaceResourceOpenRequest } from "../apiclient/workspaces/apis/RestApi";

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, WorkspaceResource as ApiWorkspaceResource } from '../apiclient/workspaces';
import WorkspaceService from './WorkspaceService';

class WorkspaceResourceService {

  async getWorkspaceResource(id: number): Promise<ApiWorkspaceResource> {
    const wsrigr: WorkspaceresourceIdGetRequest = { id };
    let result: ApiWorkspaceResource = null;
    await WorkspaceService.workspacesApi.workspaceresourceIdGet(wsrigr).then((workspaceresource: ApiWorkspaceResource) => {
      result = workspaceresource;
    });
    return result;
  }

  async workspacesControllerWorkspaceResourceOpen(id: number): Promise<void> {
      const wsrogr: WorkspacesControllerWorkspaceResourceOpenRequest = { id };
      await WorkspaceService.workspacesApi.workspacesControllerWorkspaceResourceOpen(wsrogr).then(() => {
        //
      });
  }
}

export default new WorkspaceResourceService();
