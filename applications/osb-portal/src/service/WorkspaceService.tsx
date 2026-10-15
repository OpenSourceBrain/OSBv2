import {
  WorkspaceIdGetRequest,
  WorkspaceGetRequest,
} from "../apiclient/workspaces";

import {
  Workspace,
  WorkspaceResource,
  OSBApplications,
  SampleResourceTypes,
} from "../types/workspace";
import { FeaturedType } from "../types/global";

import * as workspaceApi from "../apiclient/workspaces/apis";
import {
  Configuration,
  RestApi,
  InlineResponse200,
  Workspace as ApiWorkspace,
  RepositoryResourceNode,
  RepositoryResource,
  ResourceOrigin,
  InlineResponse2003,
  Tag,
  User,
} from "../apiclient/workspaces";

import { mapResource, mapPostUrlResource } from "./WorkspaceResourceService";
import { Page } from "../types/model";

import SearchFilter from "../types/searchFilter";

const PER_PAGE_DEFAULT = 24;
const workspacesApiUri = "/proxy/workspaces/api";

class WorkspaceService {
  
  workspacesApi: workspaceApi.RestApi = null;
  accessToken: string = null;

  constructor() {
    this.initApis(null);
  }

  initApis = (token: string) => {
    this.accessToken = token;
    this.workspacesApi = new workspaceApi.RestApi(
      new Configuration({ basePath: workspacesApiUri, accessToken: token })
    );
  };

  async getWorkspace(id: number): Promise<Workspace> {
    const wsigr: WorkspaceIdGetRequest = { id };

    const result = await this.workspacesApi.workspaceIdGet(wsigr);
    if (!result) {
      throw new Error("Workspace not found");
    }
    const ws = mapWorkspace(result);
    if (!ws) {
      throw new Error("Workspace not found");
    }
    return ws;
  }

  /**
   * Ensure the workspace volume exists and is ready (bound) before the app
   * iframe is spawned. The backend blocks up to 5s waiting for the PVC; if it
   * is still not ready it answers 503, which we surface via `volumeNotReady` so
   * the caller can show a temporary, retryable error instead of spawning the
   * iframe. Only a 503 is retryable — other statuses are reported as-is so the
   * caller can tell a transient storage hiccup from a real auth/not-found error.
   *
   * NOTE: this uses fetch rather than `this.workspacesApi` because the generated
   * client does not yet expose the `/workspace/{id}/open` operation; switch to
   * the generated client once the apiclient is regenerated from the OpenAPI
   * spec. The bearer token is taken from the same `accessToken` the client uses.
   */
  async ensureWorkspaceReady(id: number): Promise<void> {
    const response = await fetch(`${workspacesApiUri}/workspace/${id}/open`, {
      headers: this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {},
    });
    if (response.ok) {
      return;
    }
    const error: any = new Error(
      `Could not open workspace ${id} (status ${response.status})`
    );
    error.status = response.status;
    // 503 => volume not ready yet: a transient, retryable server error.
    error.volumeNotReady = response.status === 503;
    throw error;
  }

  async refreshResources(selectedWorkspaceId: any) {
    return this.workspacesApi.workspacesControllersWorkspaceControllerImportResources(
      { id: selectedWorkspaceId, inlineObject: {} }
    );
  }

  async fetchWorkspaces(
    isPublic = false,
    isFeatured = false,
    page = 1,
    perPage = 24
  ): Promise<Page<Workspace>> {
    // ToDo: pagination & size of pagination
    const params: any = {};
    if (isPublic) {
      params.publicable = "true";
    }
    if (isFeatured) {
      params.featured = "true";
    }

    const wspr: WorkspaceGetRequest = {
      q: Object.keys(params)
        .map((k) => `${k}=${params[k]}`)
        .join("+"),
      page,
      perPage,
    };
    if (this.workspacesApi) {
      const response: InlineResponse200 = await this.workspacesApi.workspaceGet(
        wspr
      );
      return {
        items: response.workspaces.map(mapWorkspace),
        totalPages: response.pagination.numberOfPages,
        total: response.pagination.total,
      };
    } else {
      console.debug("Attempting to fetch workspaces before init");
    }

    return null;
  }

  async fetchWorkspacesByFilter(
    isPublic: boolean = false,
    isFeatured: boolean = false,
    page: number = 1,
    filter: SearchFilter,
    size: number = PER_PAGE_DEFAULT
  ): Promise<Page<Workspace>> {
    const params: any = {};
    if (isPublic) {
      params.publicable = "true";
    }
    if (isFeatured) {
      params.featured = "true";
    }

    if (filter.text) {
      params.name__like = filter.text;
      params.description__like = filter.text;
    }

    if (filter.user_id) {
      params.user_id = filter.user_id;
    }
    // The workspace page does not have a separate tag filter, so the search text is used for all query fields
    const nameAndSummaryQuery = Object.keys(params)
      .map((k) => `${k}=${params[k]}`)
      .join("+");
    const tags =
      filter.tags && filter.tags.length > 0 ? `${filter.tags.join("+")}` : "";

    const response: InlineResponse200 = await this.workspacesApi.workspaceGet({
      page,
      q: nameAndSummaryQuery,
      perPage: size,
      tags,
    });
    return {
      items: response.workspaces.map(mapWorkspace),
      totalPages: response.pagination.numberOfPages,
      total: response.pagination.total,
    };
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
    const wspr: workspaceApi.WorkspacePostRequest = {
      workspace: this.mapWorkspaceToApi(ws),
    };
    return this.workspacesApi.workspacePost(wspr);
  }

  async cloneWorkspace(workspaceId: number) {
    return this.workspacesApi.workspacesControllersWorkspaceControllerWorkspaceClone(
      { id: workspaceId }
    );
  }

  private mapWorkspaceToApi(ws: Workspace): ApiWorkspace {
    return {
      ...ws,
      resources: ws.resources && ws.resources.map(mapPostUrlResource),
      timestampCreated: undefined,
      timestampUpdated: undefined,
      user: undefined,
    };
  }

  async deleteWorkspace(workspaceId: number) {
    return this.workspacesApi.workspaceIdDelete({ id: workspaceId });
  }

  async updateWorkspace(workspace: Workspace) {
    await this.workspacesApi.workspaceIdPut({
      id: workspace.id,
      workspace: this.mapWorkspaceToApi({
        ...workspace,
        resources: undefined,
        id: undefined,
      }),
    });
    return workspace;
  }

  async updateWorkspaceThumbnail(
    workspaceId: number,
    thumbNailBlob: Blob
  ): Promise<any> {
    const wspr: workspaceApi.WorkspacesControllersWorkspaceControllerSetthumbnailRequest =
      { id: workspaceId, thumbNail: thumbNailBlob };
    await this.workspacesApi.workspacesControllersWorkspaceControllerSetthumbnail(
      wspr
    );
  }

  async importResourcesToWorkspace(
    workspaceId: number,
    resources: ResourceOrigin[]
  ): Promise<void> {
    const requestObject = {
      id: workspaceId,
      inlineObject: { resourceorigins: resources },
    };

    return this.workspacesApi.workspacesControllersWorkspaceControllerImportResources(
      requestObject
    );
  }

  async getAllAvailableTags(
    page?: number,
    perPage?: number,
    q?: string
  ): Promise<Tag[]> {
    const requestObject = {
      page,
      perPage,
      q,
    };
    return (await this.workspacesApi.tagGet(requestObject)).tags;
  }
}

function mapWorkspace(workspace: ApiWorkspace): Workspace {
  const defaultResourceId =
    workspace.lastOpenedResourceId ||
    (workspace?.resources[0]?.id && workspace?.resources[0]?.id > 0);
  const resources: WorkspaceResource[] = workspace.resources.map(mapResource);
  const lastOpen: WorkspaceResource = defaultResourceId
    ? resources.find(
          (resource) => resource.id === defaultResourceId
        )
    : null;
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
    shareType: workspace.publicable
      ? FeaturedType.Public
      : FeaturedType.Private,
    volume: "1",
    defaultApplication: lastOpen
      ? lastOpen.type.application
      : resources
      ? resources[0]?.type?.application
      : OSBApplications.jupyter,
  };
}

export default new WorkspaceService();
