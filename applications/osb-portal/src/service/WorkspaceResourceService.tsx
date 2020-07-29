import { WorkspaceresourceIdGetRequest, WorkspacesControllerWorkspaceResourceOpenRequest } from "../apiclient/workspaces/apis/RestApi";

import * as workspaceApi from '../apiclient/workspaces/apis';
import { Configuration, WorkspaceResource as ApiWorkspaceResource, ResourceType } from '../apiclient/workspaces';
import WorkspaceService from './WorkspaceService';
import { WorkspaceResource, OSBApplications, SampleResourceTypes } from "../types/workspace";

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

export function mapPostResource(resource: WorkspaceResource): ApiWorkspaceResource {
  return {
    ...resource,
    resourceType: resource.type.application.subdomain === 'nwbexplorer' ? ResourceType.E : ResourceType.M // TODO improve
  }
}

export default new WorkspaceResourceService();
