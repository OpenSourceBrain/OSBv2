import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace } from '../apiclient/workspaces';
import store from '../store/store';
import { fetchWorkspacesAction } from '../store/actions/workspaces';
import WorkspaceResourceService, { mapResource, mapPostResource } from './WorkspaceResourceService';
const workspacesApiUri = '/api/workspaces/api';

class WorkspaceService {
  workspacesApi: RestApi = null;
  accessToken: string = null;
  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspace(id: number): Promise<Workspace> {
    const wsigr: WorkspaceIdGetRequest = { id };
    const result = await this.workspacesApi.workspaceIdGet(wsigr);

    const ws = await mapWorkspace(result);
    return ws;
  }


  async fetchWorkspaces(): Promise<Workspace[]> {
    // ToDo: pagination & size of pagination
    const wspr: WorkspaceGetRequest = {};
    if (this.workspacesApi) {
      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(wspr);
      return Promise.all(response.workspaces.map(mapWorkspace));
    } else {
      console.debug('Attempting to fetch workspaces before init');
    }

    return null;
  }

  async createWorkspace(newWorkspace: Workspace): Promise<any> {
    const wspr: workspaceApi.WorkspacePostRequest = { workspace: { name: newWorkspace.name, description: newWorkspace.description, resources: newWorkspace.resources.map(mapPostResource) } };
    const newCreatedWorkspace = await this.workspacesApi.workspacePost(wspr).then((workspace) => {
      if (workspace && workspace.id) {
        // TODO: if not workspace or no id raise an error
        store.dispatch(fetchWorkspacesAction());
      }
      return workspace;
    });

    return newCreatedWorkspace;
  };

  async updateWorkspaceThumbnail(workspaceId: number, thumbNailBlob: Blob): Promise<any> {
    const wspr: workspaceApi.WorkspacesControllerWorkspaceSetthumbnailRequest = { id: workspaceId, thumbNail: thumbNailBlob };
    await this.workspacesApi.workspacesControllerWorkspaceSetthumbnail(wspr);
  };
}

async function mapWorkspace(workspace: ApiWorkspace): Promise<Workspace> {
  const defaultResourceId = workspace.lastOpenedResourceId || workspace?.resources[0]?.id;
  const resources: WorkspaceResource[] = null; // TODO map resources
  const lastOpen: WorkspaceResource = defaultResourceId ? mapResource(workspace.resources.find(resource => resource.id === defaultResourceId)) : { name: "Generic", type: SampleResourceTypes.g, location: '' };

  return {
    ...workspace,
    resources,
    lastOpen,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}

export default new WorkspaceService();
