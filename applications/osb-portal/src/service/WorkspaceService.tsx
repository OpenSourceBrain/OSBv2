import { WorkspaceIdGetRequest, WorkspaceGetRequest } from "../apiclient/workspaces/apis/RestApi";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types//global';

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, RestApi, InlineResponse200, Workspace as ApiWorkspace, RepositoryResourceNode, RepositoryResource, ResourceOrigin, InlineResponse2003, Tag } from '../apiclient/workspaces';

import { mapResource, mapPostUrlResource } from './WorkspaceResourceService';
import { Page } from "../types/model";


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



  async fetchWorkspaces(isPublic = false, isFeatured = false, page = 1): Promise<Page<Workspace>> {
    // ToDo: pagination & size of pagination
    const params: any = {};
    if (isPublic && !isFeatured) {
      params.publicable = 'true';
    }
    if (isFeatured) {
      params.featured = 'true';
    }



    const wspr: WorkspaceGetRequest = { q: Object.keys(params).map(k => `${k}=${params[k]}`).join("+"), page };
    if (this.workspacesApi) {

      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(wspr);
      return { items: response.workspaces.map(mapWorkspace), totalPages: response.pagination.numberOfPages, total: response.pagination.total };


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

  async createWorkspace(ws: Workspace): Promise<ApiWorkspace> {
    const wspr: workspaceApi.WorkspacePostRequest = { workspace: this.mapWorkspaceToApi(ws) };
    return this.workspacesApi.workspacePost(wspr);
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { ...ws, resources: ws.resources && ws.resources.map(mapPostUrlResource), timestampCreated: undefined, timestampUpdated: undefined };
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

  async getAllAvailableTags(page?: number, perPage?: number, q?: string): Promise<Tag[]> {
    const requestObject = {
      page,
      perPage,
      q,
    }
    return (await this.workspacesApi.tagGet(requestObject)).tags;
  }
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  const defaultResourceId = workspace.lastOpenedResourceId || workspace?.resources[0]?.id;
  const resources: WorkspaceResource[] = workspace.resources.map(mapResource);
  const lastOpen: WorkspaceResource = defaultResourceId ? mapResource(workspace.resources.find(resource => resource.id === defaultResourceId)) : { workspaceId: workspace.id, name: "Generic", type: SampleResourceTypes.g };
  const tags: Tag[] = workspace.tags;

  return {
    ...workspace,
    resources,
    lastOpen,
    tags,
    userId: workspace.userId,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}


export default new WorkspaceService();
