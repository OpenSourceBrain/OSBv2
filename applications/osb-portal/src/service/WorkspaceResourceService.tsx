import { WorkspaceresourceIdGetRequest, WorkspacesControllerWorkspaceResourceOpenRequest } from "../apiclient/workspaces/apis/RestApi";

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, WorkspaceResource as ApiWorkspaceResource, ResourceType } from '../apiclient/workspaces';
import WorkspaceService from './WorkspaceService';
import { WorkspaceResource, OSBApplications, SampleResourceTypes, Workspace } from "../types/workspace";

class WorkspaceResourceService {

  async getWorkspaceResource(id: number): Promise<WorkspaceResource> {
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
}
export function mapResource(resource: ApiWorkspaceResource): WorkspaceResource {
  console.log(SampleResourceTypes)
  return {
    ...resource,
    type: SampleResourceTypes[resource.resourceType.toLowerCase()]
  };
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
    resourceType: mapResourceType(resource)
  }
}

export default new WorkspaceResourceService();
