import { Workspace as WorkspaceBase } from '../apiclient/workspaces/models/Workspace'
import { FeaturedType } from './global'

// Workspace object
export interface Workspace extends WorkspaceBase {
    lastResource?: any; // TODO add to api
    shareType: FeaturedType;
    volume: string; // Volume id
};
