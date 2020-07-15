import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace } from '../apiclient/workspaces';
import store from '../store/store';
import { fetchWorkspacesAction } from '../store/actions/workspaces';
const workspacesApiUri = '/api/workspaces/api';

class WorkspaceService {
  workspacesApi: RestApi = null;
  initApis = (token: string) => {
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspace(id: number): Promise<Workspace> {
    const wsigr: WorkspaceIdGetRequest = { id };
    let result: Workspace = null;
    await this.workspacesApi.workspaceIdGet(wsigr).then((workspace: ApiWorkspace) => {
      result = mapWorkspace(workspace)
    });
    return result;
  }


  async fetchWorkspaces() {
    // ToDo: pagination & size of pagination
    const wspr: WorkspaceGetRequest = {};
    let resultWorkspaces: Workspace[] = [];
    await this.workspacesApi.workspaceGet(wspr).then((response: InlineResponse200) => {
      resultWorkspaces = response.workspaces.map(mapWorkspace);
    })
    return resultWorkspaces;
  }

  async createWorkspace(newWorkspace: Workspace) {


    const wspr: workspaceApi.WorkspacePostRequest = { workspace: newWorkspace };
    await this.workspacesApi.workspacePost(wspr).then((workspace) => {
      if (workspace && workspace.id) {
        // TODO: if not workspace or no id raise an error
        store.dispatch(fetchWorkspacesAction());
      }
    });
  };
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  return {
    ...workspace,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}



export default new WorkspaceService();
