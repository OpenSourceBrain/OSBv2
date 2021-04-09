
import { WorkspaceActions } from '../reducers/workspaces'

export const { loadPublicWorkspaces, loadUserWorkspaces, selectWorkspace, refreshWorkspace, showPublicWorkspaces, showUserWorkspaces, deleteWorkspace, updateWorkspace, resourceAdded } = WorkspaceActions;


export const refreshWorkspaces = () => ({ type: refreshWorkspaces.toString() });

