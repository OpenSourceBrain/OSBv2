import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace } from '../apiclient/workspaces';

import WorkspaceResourceService, { mapResource, mapPostResource } from './WorkspaceResourceService';
const workspacesApiUri = '/api/workspaces/api';

class WorkspaceService {

  workspacesApi: RestApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspace(id: number): Promise<Workspace> {
    const wsigr: WorkspaceIdGetRequest = { id };
    const result = await this.workspacesApi.workspaceIdGet(wsigr);

    const ws = mapWorkspace(result);
    return ws;
  }



  async fetchWorkspaces(featured = false): Promise<Workspace[]> {
    // ToDo: pagination & size of pagination
    const wspr: WorkspaceGetRequest = { q: 'publicable=' + (featured ? 'True' : 'False') };
    if (this.workspacesApi) {
      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(wspr);
      return response.workspaces.map(mapWorkspace);
    } else {
      console.debug('Attempting to fetch workspaces before init');
    }

    return null;
  }

  async createWorkspace(newWorkspace: Workspace): Promise<any> {
    if (!newWorkspace.description) {
      newWorkspace.description = newWorkspace.name;
    }
    const wspr: workspaceApi.WorkspacePostRequest = { workspace: this.mapWorkspaceToApi(newWorkspace) };
    const newCreatedWorkspace = await this.workspacesApi.workspacePost(wspr).then((workspace) => {
      return workspace;
    });

    return newCreatedWorkspace;
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { name: ws.name, description: ws.description, publicable: ws.publicable, resources: ws.resources && ws.resources.map(mapPostResource) };
  }

  async deleteWorkspace(workspaceId: number) {
    this.workspacesApi.workspaceIdDelete({ id: workspaceId });
  }

  async updateWorkspace(workspace: Workspace) {
    this.workspacesApi.workspaceIdPut({ id: workspace.id, workspace: this.mapWorkspaceToApi({ ...workspace, resources: undefined }) });
  }

  async updateWorkspaceThumbnail(workspaceId: number, thumbNailBlob: Blob): Promise<any> {
    const wspr: workspaceApi.WorkspacesControllerWorkspaceSetthumbnailRequest = { id: workspaceId, thumbNail: thumbNailBlob };
    await this.workspacesApi.workspacesControllerWorkspaceSetthumbnail(wspr);
  };
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  const defaultResourceId = workspace.lastOpenedResourceId || workspace?.resources[0]?.id;
  const resources: WorkspaceResource[] = workspace.resources.map(mapResource);
  const lastOpen: WorkspaceResource = defaultResourceId ? mapResource(workspace.resources.find(resource => resource.id === defaultResourceId)) : { workspaceId: workspace.id, name: "Generic", type: SampleResourceTypes.g, location: '' };

  return {
    ...workspace,
    resources,
    lastOpen,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}


export default new WorkspaceService();
