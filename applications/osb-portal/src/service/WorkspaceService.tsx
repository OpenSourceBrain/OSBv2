import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, WorkspaceApi, WorkspaceResourceApi, InlineResponse200, Workspace as ApiWorkspace } from '../apiclient/workspaces';

import WorkspaceResourceService, { mapResource, mapPostUrlResource } from './WorkspaceResourceService';

const workspacesApiUri = '/api/workspaces/api';

class WorkspaceService {

  restApi: RestApi = null;
  workspaceApi: WorkspaceApi;
  workspaceResourceApi: WorkspaceResourceApi;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.restApi = new workspaceApi.RestApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
    this.workspaceResourceApi = new WorkspaceResourceApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
    this.workspaceApi = new workspaceApi.WorkspaceApi(new Configuration({ basePath: workspacesApiUri, accessToken: token }));
  }

  async getWorkspace(id: number): Promise<Workspace> {
    const wsigr: WorkspaceIdGetRequest = { id };
    let ws = null;
    await this.restApi.workspaceIdGet(wsigr).then(result => ws = mapWorkspace(result));
    if (!ws) {
      throw new Error("Workspace not found")
    }
    return ws;
  }



  async fetchWorkspaces(featured = false): Promise<Workspace[]> {
    // ToDo: pagination & size of pagination
    const wspr: WorkspaceGetRequest = featured ? { q: 'publicable=true' } : {};
    if (this.restApi) {
      const response: InlineResponse200 = await this.restApi.workspaceGet(wspr);
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
    const newCreatedWorkspace = await this.restApi.workspacePost(wspr).then((workspace) => {
      return workspace;
    });

    return newCreatedWorkspace;
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { name: ws.name, description: ws.description, publicable: ws.publicable, resources: ws.resources && ws.resources.map(mapPostUrlResource) };
  }

  async deleteWorkspace(workspaceId: number) {
    this.restApi.workspaceIdDelete({ id: workspaceId });
  }

  async updateWorkspace(workspace: Workspace) {
    await this.restApi.workspaceIdPut({ id: workspace.id, workspace: this.mapWorkspaceToApi({ ...workspace, resources: undefined, id: undefined }) });
    return workspace;
  }

  async updateWorkspaceThumbnail(workspaceId: number, thumbNailBlob: Blob): Promise<any> {
    const wspr: workspaceApi.SetthumbnailRequest = { id: workspaceId, thumbNail: thumbNailBlob };
    await this.workspaceApi.setthumbnail(wspr);
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
    owner: workspace.userId,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}


export default new WorkspaceService();
