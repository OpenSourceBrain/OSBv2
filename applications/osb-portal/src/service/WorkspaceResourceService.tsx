import { WorkspaceresourceIdGetRequest, WorkspacesControllerWorkspaceResourceOpenRequest } from "../apiclient/workspaces/apis/RestApi";

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, WorkspaceResource as ApiWorkspaceResource, ResourceType, ResourceStatus as ApiResourceStatus } from '../apiclient/workspaces';
import WorkspaceService from './WorkspaceService';
import { WorkspaceResource, OSBApplications, SampleResourceTypes, Workspace, ResourceStatus } from "../types/workspace";


class WorkspaceResourceService {


  async addResource(workspace: Workspace, url: string, name: string) {
    return WorkspaceService.workspacesApi.workspaceresourcePost(
      {
        workspaceResource:
        {
          name: name ? name : urlToName(url),
          location: url,
          resourceType: ResourceType.G,
          workspaceId: workspace.id,
        }
      });
  }

  async resourceAdded(workspaceResource: WorkspaceResource) {
    return WorkspaceService.workspacesApi.workspaceresourcePost(
      {
        workspaceResource: mapPostAddedResource(workspaceResource)
      });
  }

  async getResource(id: number): Promise<WorkspaceResource> {
    const wsrigr: WorkspaceresourceIdGetRequest = { id };
    const result: ApiWorkspaceResource = await WorkspaceService.workspacesApi.workspaceresourceIdGet(wsrigr);
    return mapResource(result);
  }


  async workspacesControllerWorkspaceResourceOpen(id: number): Promise<void> {
    const wsrogr: WorkspacesControllerWorkspaceResourceOpenRequest = { id };
    await WorkspaceService.workspacesApi.workspacesControllerWorkspaceResourceOpen(wsrogr).then(() => {
      //
    });
  }

  async deleteResource(resource: WorkspaceResource) {
    WorkspaceService.workspacesApi.workspaceresourceIdDelete({ id: resource.id })
  }


}
export function urlToName(url: string): string {
  return url.split('/').slice(-1).pop();
}

export function mapResource(resource: ApiWorkspaceResource): WorkspaceResource {
  if (!resource) {
    return null;
  }
  return {
    ...resource,
    type: SampleResourceTypes[resource.resourceType.toLowerCase()],
    status: mapResourceStatus(resource)
  };
}

function mapResourceStatus(resource: ApiWorkspaceResource): ResourceStatus {
  switch (resource.status) {
    case ApiResourceStatus.A: return ResourceStatus.available;
    case ApiResourceStatus.E: return ResourceStatus.error;
    default:
      return ResourceStatus.pending;
  }
}

function mapResourceType(resource: WorkspaceResource) {
  if (!resource.type) {
    return ResourceType.NULL;
  }
  switch (resource.type.application.subdomain) {
    case 'nwbexplorer':
      return ResourceType.E
    case 'netpyne':
      return ResourceType.M
    default:
      return ResourceType.G
  }
}

export function mapPostUrlResource(resource: WorkspaceResource): ApiWorkspaceResource {
  return {
    ...resource,
    status: ApiResourceStatus.P,
    resourceType: mapResourceType(resource)
  }
}

export function mapPostAddedResource(resource: WorkspaceResource): ApiWorkspaceResource {
  return {
    ...resource,
    status: ApiResourceStatus.A,
    resourceType: mapResourceType(resource)
  }
}

export default new WorkspaceResourceService();
