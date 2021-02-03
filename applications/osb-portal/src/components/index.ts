import { connect } from 'react-redux'

import { App as app } from './App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { WorkspaceToolBox as workspacetoolbox } from './workspace/NewWorkspaceToolBox'
import workspaceInteractions from './workspace/drawer/WorkspaceInteractions';

import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './workspace/drawer/WorkspaceDrawer'
import { ErrorDialog as errorDialog } from './error-dialog/ErrorDialog'
import { WorkspaceFrame as workspaceFrame } from './workspace/WorkspaceFrame';
import { ProtectedRoute as protectedRoute } from './auth/ProtectedRouter';

import { RootState } from '../store/rootReducer'
import * as WorkspacesActions from '../store/actions/workspaces'
import { toggleDrawer } from '../store/actions/drawer';
import { setError } from '../store/actions/error';
import newWorkspaceAskUser from './workspace/NewWorkspaceAskUser';



const mapWorkspacesStateToProps = (state: RootState) => {
  console.log(state)
  return ({
    showPublic: state.workspaces?.showPublic,
  })
};



const mapSelectedWorkspaceStateToProps = (state: RootState) => ({
  workspace: state.workspaces?.selectedWorkspace,
});

const dispatchWorkspaceProps = {
  ...WorkspacesActions
};




const mapDrawerStateToProps = (state: RootState) => ({
  drawer: state.drawer,
});

const dispatchDrawerProps = {
  onToggleDrawer: toggleDrawer
};

const mapErrorStateToProps = (state: RootState) => ({
  error: state.error,
});

const dispatchErrorProps = {
  setError
};

export const Workspaces: any = connect(mapWorkspacesStateToProps, dispatchWorkspaceProps)(workspace)

export const WorkspaceToolBox = connect(null, dispatchWorkspaceProps)(workspacetoolbox)
export { banner as Banner };
export const Header = connect(null, dispatchDrawerProps)(header)
export const WorkspaceDrawer = connect(mapSelectedWorkspaceStateToProps, dispatchDrawerProps)(workspacedrawer) as any // any to fix weird type mapping error
export const WorkspaceInteractions = connect(null, dispatchWorkspaceProps)(workspaceInteractions) as any

export const App = connect(mapWorkspacesStateToProps, dispatchWorkspaceProps)(app)
export const ErrorDialog = connect(mapErrorStateToProps, dispatchErrorProps)(errorDialog)
export const WorkspaceFrame = connect(mapSelectedWorkspaceStateToProps, null)(workspaceFrame)
export {newWorkspaceAskUser as NewWorkspaceAskUser}
export {protectedRoute as ProtectedRoute }
