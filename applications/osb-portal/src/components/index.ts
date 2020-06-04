import { connect } from 'react-redux'

import { App as app } from './App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { WorkspaceToolBox as workspacetoolbox } from './workspace/WorkspaceToolBox'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './drawer/WorkspaceDrawer'
import { ErrorDialog as errorDialog } from './error-dialog/ErrorDialog'

import { RootState } from '../store/rootReducer'
import { fetchWorkspacesAction } from '../store/actions/workspaces'
import { fetchModelsAction } from '../store/actions/models';
import { fetchNWBFilesAction } from '../store/actions/nwbfiles';
import { userLogin, userLogout } from '../store/actions/user';
import { toggleDrawer } from '../store/actions/drawer';
import { setError } from '../store/actions/error';

import { keycloak } from '../index';

const mapWorkspaceStateToProps = (state: RootState) => ({
  workspaces: state.workspaces,
});
const dispatchWorkspaceProps = {
  onLoadWorkspaces: fetchWorkspacesAction,
  onLoadModels: fetchModelsAction,
  onLoadNWBFiles: fetchNWBFilesAction,
  onUserLogin: userLogin,
  keycloak
}

const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
  keycloak
});

const dispatchUserProps = {
  onUserLogin: userLogin,
  onUserLogout: userLogout
}
const mapDrawerStateToProps = (state: RootState) => ({
  drawer: state.drawer,
});
const dispatchDrawerProps = {
  onToggleDrawer: toggleDrawer
}
const mapErrorStateToProps = (state: RootState) => ({
  error: state.error,
})
const dispatchErrorProps = {
  setError
}

export const Workspaces = connect(mapWorkspaceStateToProps, dispatchWorkspaceProps)(workspace)
export const WorkspaceToolBox = connect(mapUserStateToProps, dispatchWorkspaceProps)(workspacetoolbox)
export const Banner = connect(mapUserStateToProps)(banner)
export const Header = connect(mapUserStateToProps, {...dispatchUserProps, ...dispatchDrawerProps})(header)
export const WorkspaceDrawer = connect(mapDrawerStateToProps, dispatchDrawerProps)(workspacedrawer)
export const App = connect(mapWorkspaceStateToProps, dispatchWorkspaceProps)(app)
export const ErrorDialog = connect(mapErrorStateToProps, dispatchErrorProps)(errorDialog)
