import { Workspace as WorkspaceBase } from '../apiclient/workspaces/models/Workspace'
import { WorkspaceResource } from '../apiclient/workspaces/models/WorkspaceResource'
import { FeaturedType } from './global'

// Workspace object
export interface Workspace extends WorkspaceBase {
    lastResource?: WorkspaceResource; // TODO add to api
    shareType: FeaturedType;
    volume: string; // Volume id
    lastType: string;
};
