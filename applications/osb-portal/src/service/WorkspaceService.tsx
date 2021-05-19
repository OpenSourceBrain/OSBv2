import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace, RepositoryResourceNode, RepositoryResource, ResourceOrigin } from '../apiclient/workspaces';

import WorkspaceResourceService, { mapResource, mapPostUrlResource } from './WorkspaceResourceService';

import { InlineObject } from '../apiclient/workspaces/models/InlineObject';

const workspacesApiUri = '/proxy/workspaces/api';

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
    let ws = null;
    await this.workspacesApi.workspaceIdGet(wsigr).then(result => ws = mapWorkspace(result));
    if (!ws) {
      throw new Error("Workspace not found")
    }
    return ws;
  }



  async fetchWorkspaces(featured = false): Promise<Workspace[]> {
    // ToDo: pagination & size of pagination
    const wspr: WorkspaceGetRequest = featured ? { q: 'publicable=true' } : {};
    if (this.workspacesApi) {
      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(wspr);
      return response.workspaces.map(mapWorkspace);
    } else {
      console.debug('Attempting to fetch workspaces before init');
    }

    return null;
  }

  async createOrUpdateWorkspace(ws: Workspace): Promise<any> {
    if (!ws.description) {
      ws.description = ws.name;
    }
    if (!ws.id) {
      return this.createWorkspace(ws);
    }
    return this.updateWorkspace(ws);
  }

  async createWorkspace(ws: Workspace): Promise<any> {
    const wspr: workspaceApi.WorkspacePostRequest = { workspace: this.mapWorkspaceToApi(ws) };
    const newCreatedWorkspace = await this.workspacesApi.workspacePost(wspr).then((workspace) => {
      return workspace;
    });

    return newCreatedWorkspace;
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { name: ws.name, description: ws.description, publicable: ws.publicable, resources: ws.resources && ws.resources.map(mapPostUrlResource) };
  }

  async deleteWorkspace(workspaceId: number) {
    this.workspacesApi.workspaceIdDelete({ id: workspaceId });
  }

  async updateWorkspace(workspace: Workspace) {
    await this.workspacesApi.workspaceIdPut({ id: workspace.id, workspace: this.mapWorkspaceToApi({ ...workspace, resources: undefined, id: undefined }) });
    return workspace;
  }

  async updateWorkspaceThumbnail(workspaceId: number, thumbNailBlob: Blob): Promise<any> {
    const wspr: workspaceApi.WorkspacesControllersWorkspaceControllerSetthumbnailRequest = { id: workspaceId, thumbNail: thumbNailBlob };
    await this.workspacesApi.workspacesControllersWorkspaceControllerSetthumbnail(wspr);
  }

  async importResourcesToWorkspace(workspaceId: number, resources: ResourceOrigin[]): Promise<void> {
    const requestObject = {
      id: workspaceId,
      inlineObject: { resourceorigins: resources }
    }
    await this.workspacesApi.workspacesControllersWorkspaceControllerImportResources(requestObject);
  }
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  const defaultResourceId = workspace.lastOpenedResourceId || workspace?.resources[0]?.id;
  const resources: WorkspaceResource[] = workspace.resources.map(mapResource);
  const lastOpen: WorkspaceResource = defaultResourceId ? mapResource(workspace.resources.find(resource => resource.id === defaultResourceId)) : { workspaceId: workspace.id, name: "Generic", type: SampleResourceTypes.g };

  return {
    ...workspace,
    resources,
    lastOpen,
    userId: workspace.userId,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}


export default new WorkspaceService();
