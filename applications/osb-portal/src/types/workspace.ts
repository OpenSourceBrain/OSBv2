import { Workspace as WorkspaceBase } from '../apiclient/workspaces/models/Workspace'
import { WorkspaceResource as WR } from '../apiclient/workspaces/models/WorkspaceResource'
import { FeaturedType } from './global'
import { ResourceType as ResourceTypeApi } from '../apiclient/workspaces'

export interface OSBApplication {
    name: string,
    subdomain: string
}

export enum ResourceStatus {
    pending= "PENDING",
    available= "AVAILABLE",
    error= "ERROR"
}
export interface WorkspaceResource {
    workspaceId: number,
    id?: number,
    name: string,
    location: string,
    type: ResourceType,
    status?: ResourceStatus
}

export interface ResourceType {
    application: OSBApplication
}



export const OSBApplications: { [id: string]: OSBApplication } = {
    nwbexplorer: { name: "NWB Explorer", subdomain: "nwbexplorer" },
    netpyne: { name: "NetPyNE", subdomain: "netpyne" },
    jupyter: { name: "Jupyter", subdomain: "jupyter" },
}


export const SampleResourceTypes = {
    [ResourceTypeApi.E.toString()]: { application: OSBApplications.nwbexplorer, name: "NWB File" },
    [ResourceTypeApi.M.toString()]: { application: OSBApplications.netpyne, name: "NetPyNE model" },
    [ResourceTypeApi.G.toString()]: { application: OSBApplications.jupyter, name: "Generic file" }
}

// Workspace object
export interface Workspace {
    lastOpen?: WorkspaceResource;
    resources?: WorkspaceResource[],
    shareType: FeaturedType;
    volume: string; // Volume id
    id?: number;
    name: string;
    description: string;
    timestampCreated?: Date;
    timestampUpdated?: Date;
    thumbnail?: string;
    publicable?: boolean;
    license?: string;
    [other: string]: any;
};
