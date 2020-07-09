import { Workspace as WorkspaceBase } from '../apiclient/workspaces/models/Workspace'
import { FeaturedType } from './global'

// Workspace object
export interface Workspace extends WorkspaceBase {
    shareType: FeaturedType;
    volume: string; // Volume id
};
