import { WorkspaceIdGetRequest, WorkspaceGetRequest,  Configuration, InlineResponse200, Workspace as ApiWorkspace, ResourceOrigin, Tag, User } from "../apiclient/workspaces";

import { Workspace, WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";
import { FeaturedType } from '../types/global';

import * as workspaceApi from '../apiclient/workspaces/apis';


import { mapResource, mapPostUrlResource } from './WorkspaceResourceService';
import { Page } from "../types/model";

import SearchFilter from '../types/searchFilter';

const PER_PAGE_DEFAULT = 10;
const workspacesApiUri = '/proxy/workspaces/api';

class WorkspaceService {

  workspacesApi: workspaceApi.RestApi = null;
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
    if (!result) {
      throw new Error("Workspace not found")
    }
    const ws = mapWorkspace(result);
    if (!ws) {
      throw new Error("Workspace not found")
    }
    return ws;
  }



  async fetchWorkspaces(isPublic = false, isFeatured = false, page = 1, perPage = 20): Promise<Page<Workspace>> {
    // ToDo: pagination & size of pagination
    const params: any = {};
    if (isPublic) {
      params.publicable = 'true';
    }
    if (isFeatured) {
      params.featured = 'true';
    }

    const wspr: WorkspaceGetRequest = { q: Object.keys(params).map(k => `${k}=${params[k]}`).join("+"), page, perPage };
    if (this.workspacesApi) {
      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(wspr);
      return { items: response.workspaces.map(mapWorkspace), totalPages: response.pagination.numberOfPages, total: response.pagination.total };
    } else {
      console.debug('Attempting to fetch workspaces before init');
    }

    return null;
  }

  async fetchWorkspacesByFilter(isPublic: boolean = false, isFeatured: boolean = false, page: number = 1, filter: SearchFilter, size: number = PER_PAGE_DEFAULT): Promise<any>  {
    const params: any = {};
    if (isPublic) {
      params.publicable = 'true';
    }
    if (isFeatured) {
      params.featured = 'true';
    }

    if (filter.text) {
      params.name__like = filter.text
    }

    if (filter.user_id) {
      params.user_id = filter.user_id
    }
    // The workspace page does not have a separate tag filter, so the search text is used for all query fields
    const nameAndSummaryQuery = Object.keys(params).map(k => `${k}=${params[k]}`).join("+")
    const tags = filter.tags && filter.tags.length > 0 ? `${filter.tags.join('+')}` : '';

    const response: InlineResponse200 = await this.workspacesApi.workspaceGet(
      {
        page,
        q: nameAndSummaryQuery,
        perPage: size,
        tags,
      });
    return { items: response.workspaces.map(mapWorkspace), totalPages: response.pagination.numberOfPages, total: response.pagination.total };
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

  async cloneWorkspace(workspaceId: number) {
    return this.workspacesApi.workspacesControllersWorkspaceControllerWorkspaceClone({ id: workspaceId });
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return { ...ws, resources: ws.resources && ws.resources.map(mapPostUrlResource), timestampCreated: undefined, timestampUpdated: undefined, user: undefined };
  }

  async deleteWorkspace(workspaceId: number) {
    return this.workspacesApi.workspaceIdDelete({ id: workspaceId });
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
  const timestampUpdated: Date = workspace.timestampUpdated;
  const user: User = workspace.user;

  return {
    ...workspace,
    resources,
    lastOpen,
    tags,
    user,
    timestampUpdated,
    userId: workspace.userId,
    shareType: workspace.publicable ? FeaturedType.Public : FeaturedType.Private,
    volume: "1",
  }
}


export default new WorkspaceService();
