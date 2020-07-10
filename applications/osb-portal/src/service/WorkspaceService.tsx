import { WorkspaceIdGetRequest } from "../apiclient/workspaces/apis/RestApi";
import { workspacesApi } from '../middleware/osbbackend';

import { Workspace } from "../types/workspace";
import { FeaturedType } from '../types//global';


class WorkspaceService {
  async getWorkspace(id: number): Promise<Workspace> {

    const wsigr: WorkspaceIdGetRequest = {id};
    let result : Workspace = null;
    await workspacesApi.workspaceIdGet(wsigr).then(workspace => {
      result = {
        ...workspace,
        shareType: FeaturedType.Private,
        volume: "1",
      }
    });
    return result;
  }
}

export default new WorkspaceService();
