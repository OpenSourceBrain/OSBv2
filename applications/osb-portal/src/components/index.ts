import { connect } from 'react-redux'

import { App as app } from './App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { WorkspaceToolBox as workspacetoolbox } from './workspace/NewWorkspaceToolBox'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './workspace/drawer/WorkspaceDrawer'
import { ErrorDialog as errorDialog } from './error-dialog/ErrorDialog'
import { WorkspaceFrame as workspaceFrame } from './workspace/WorkspaceFrame';
import workspacePage from "./pages/WorkspacePage";

import { RootState } from '../store/rootReducer'
import { fetchWorkspacesAction, selectWorkspace, loadUserWorkspaces, loadWorkspaces } from '../store/actions/workspaces'
import { fetchModelsAction } from '../store/actions/models';
import { userLogin, userLogout, userRegister } from '../store/actions/user';
import { toggleDrawer } from '../store/actions/drawer';
import { setError } from '../store/actions/error';
import newWorkspaceAskUser from './workspace/NewWorkspaceAskUser';


const mapWorkspacesStateToProps = (state: RootState) => {
  console.log(state)
  return ({
    workspaces: state.workspaces?.publicWorkspaces,
    userWorkspaces: state.workspaces?.userWorkspaces
  })
};

const mapSelectedWorkspaceStateToProps = (state: RootState) => ({
  workspace: state.workspaces.selectedWorkspace,
  user: state.user,
});

const dispatchWorkspaceProps = {
  onLoadWorkspaces: fetchWorkspacesAction,
  onLoadModels: fetchModelsAction,
  login: userLogin,
  logout: userLogout,
  loadUserWorkspaces,
  loadWorkspaces,
  selectWorkspace
};

const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
});

const dispatchUserProps = {
  login: userLogin,
  logout: userLogout,
  register: userRegister
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

export const Workspaces = connect(mapWorkspacesStateToProps, dispatchWorkspaceProps)(workspace)
export const WorkspaceToolBox = connect(mapUserStateToProps, dispatchWorkspaceProps)(workspacetoolbox)
export const Banner = connect(mapUserStateToProps)(banner)
export const Header = connect(mapUserStateToProps, { ...dispatchUserProps, ...dispatchDrawerProps })(header)
export const WorkspaceDrawer = connect(mapSelectedWorkspaceStateToProps, dispatchDrawerProps)(workspacedrawer) as any // any to fix weird type mapping error
export const App = connect(mapWorkspacesStateToProps, dispatchWorkspaceProps)(app)
export const ErrorDialog = connect(mapErrorStateToProps, dispatchErrorProps)(errorDialog)
export const WorkspaceFrame = connect(mapSelectedWorkspaceStateToProps, null)(workspaceFrame)
export const WorkspacePage = connect(null, dispatchWorkspaceProps)(workspacePage)
export const NewWorkspaceAskUser = connect(null, dispatchUserProps)(newWorkspaceAskUser)
