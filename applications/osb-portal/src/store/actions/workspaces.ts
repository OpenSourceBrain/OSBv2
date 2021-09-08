
import { WorkspaceActions } from '../reducers/workspaces'

export const { loadWorkspaces, selectWorkspace, refreshWorkspace, showPublicWorkspaces, showUserWorkspaces, showFeaturedWorkspaces, deleteWorkspace, updateWorkspace, resourceAdded } = WorkspaceActions;


export const refreshWorkspaces = () => ({ type: refreshWorkspaces.toString() });

