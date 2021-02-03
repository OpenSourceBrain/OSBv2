import { Configuration, WorkspaceResource as ApiWorkspaceResource, ResourceType, ResourceStatus as ApiResourceStatus } from '../apiclient/workspaces';
import WorkspaceService from './WorkspaceService';
import { WorkspaceResource, OSBApplications, SampleResourceTypes, Workspace, ResourceStatus } from "../types/workspace";


class WorkspaceResourceService {


  async addResource(workspace: Workspace, url: string, name: string) {
    return WorkspaceService.workspacesApi.workspaceresourcePost(
      
        {
          name: name ? name : urlToName(url),
          location: url,
          resource_type: ResourceType.G,
          workspace_id: workspace.id
        }
      );
  }

  async getResource(id: number): Promise<WorkspaceResource> {
    const result = await WorkspaceService.workspacesApi.workspaceresourceIdGet(id);
    return mapResource(result.data);
  }


  async workspacesControllerWorkspaceResourceOpen(id: number): Promise<void> {
    await WorkspaceService.workspacesApi.workspacesControllerWorkspaceResourceOpen(id).then(() => {
      //
    });
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
    type: SampleResourceTypes[resource?.resource_type.toLowerCase()],
    status: mapResourceStatus(resource),
    workspaceId: resource.workspace_id
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
  switch (resource.type.application.subdomain) {
    case 'nwbexplorer':
      return ResourceType.E
    case 'netpyne':
      return ResourceType.M
    default:
      return ResourceType.G
  }
}

export function mapPostResource(resource: WorkspaceResource): ApiWorkspaceResource {
  return {
    ...resource,
    status: ApiResourceStatus.P,
    resource_type: mapResourceType(resource),
    workspace_id: resource.workspaceId
  }
}

export default new WorkspaceResourceService();
