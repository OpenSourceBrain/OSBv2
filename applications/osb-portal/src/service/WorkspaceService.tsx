import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types/global';

import * as workspaceApi from '../apiclient/workspaces';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace } from '../apiclient/workspaces';

import WorkspaceResourceService, { mapResource, mapPostResource } from './WorkspaceResourceService';
const workspacesApiUri = 'https://workspaces.v2.opensourcebrain.org/api';

class WorkspaceService {

  workspacesApi: RestApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspace(id: number): Promise<Workspace> {

    const result = await this.workspacesApi.workspaceIdGet(id);

    const ws = mapWorkspace(result.data);
    return ws;
  }



  async fetchWorkspaces(featured = false): Promise<Workspace[]> {
    // ToDo: pagination & size of pagination

    if (this.workspacesApi) {
      const response = await this.workspacesApi.workspaceGet(1, 30, featured ? 'publicable=true' : null);
      return response.data.workspaces.map(mapWorkspace);
    } else {
      console.debug('Attempting to fetch workspaces before init');
    }

    return null;
  }

  async createWorkspace(newWorkspace: Workspace): Promise<any> {
    if (!newWorkspace.description) {
      newWorkspace.description = newWorkspace.name;
    }

    const newCreatedWorkspace = await this.workspacesApi.workspacePost(this.mapWorkspaceToApi(newWorkspace)).then((workspace) => {
      return workspace;
    });

    return newCreatedWorkspace;
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { name: ws.name, description: ws.description, publicable: ws.publicable, resources: ws.resources && ws.resources.map(mapPostResource) };
  }

  async deleteWorkspace(workspaceId: number) {
    this.workspacesApi.workspaceIdDelete(workspaceId);
  }

  async updateWorkspace(workspace: Workspace) {
    this.workspacesApi.workspaceIdPut(workspace.id, this.mapWorkspaceToApi({ ...workspace, resources: undefined }));
  }

  async updateWorkspaceThumbnail(workspaceId: number, thumbNailBlob: Blob): Promise<any> {
    await this.workspacesApi.workspacesControllerWorkspaceSetthumbnail(workspaceId, thumbNailBlob);
  };
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  const defaultResourceId = workspace.last_opened_resource_id || workspace?.resources[0]?.id;
  const resources: WorkspaceResource[] = workspace.resources.map(mapResource);
  const lastOpen: WorkspaceResource = defaultResourceId ? mapResource(workspace.resources.find(resource => resource.id === defaultResourceId)) : { workspaceId: workspace.id, name: "Generic", type: SampleResourceTypes.g, location: '' };

  return {
    ...workspace,
    resources,
    lastOpen,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
    timestampCreated: workspace.timestamp_created,
    timestampUpdated: workspace.timestamp_updated
  }
}


export default new WorkspaceService();
