import { connect } from 'react-redux'

import { App as app } from '../App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { WorkspaceToolBox as workspacetoolbox } from './workspace/NewWorkspaceToolBox'
import workspaceInteractions from './workspace/drawer/WorkspaceInteractions';

import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './workspace/drawer/WorkspaceDrawer'
import { ErrorDialog as errorDialog } from './error-dialog/ErrorDialog'
import { WorkspaceFrame as workspaceFrame } from './workspace/WorkspaceFrame';
import { ProtectedRoute as protectedRoute } from './auth/ProtectedRouter';
import workspaceOpenPage from "../pages/WorkspaceOpenPage";
import workspaceEditor from './workspace/WorkspaceEditor';
import editRepoDialog from '../components/repository/EditRepoDialog';

import { RootState } from '../store/rootReducer'
import * as WorkspacesActions from '../store/actions/workspaces'
import { userLogin, userLogout, userRegister } from '../store/actions/user';
import { toggleDrawer } from '../store/actions/drawer';
import { setError } from '../store/actions/error';
import newWorkspaceAskUser from './workspace/NewWorkspaceAskUser';
import { AnyAction, Dispatch } from 'redux';

import { RepositoryPage as repositoryPage } from '../pages/RepositoryPage'
import { RepositoriesPage as repositoriesPage } from '../pages/RepositoriesPage'
import repositories from '../components/repository/Repositories';
import { retrieveAllTags, loadTags } from '../store/actions/tags';
import { WorkspaceCard as workspaceCard } from './workspace/WorkspaceCard';

const mapWorkspacesStateToProps = (state: RootState) => ({
  user: state.user,
  counter: state.workspaces?.counter
});


const mapSelectedWorkspaceStateToProps = (state: RootState) => ({
  workspace: state.workspaces?.selectedWorkspace,
  user: state.user,

});

const dispatchWorkspaceProps = {
  login: userLogin,
  logout: userLogout,
  ...WorkspacesActions
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
  onToggleDrawer: toggleDrawer,
  ...WorkspacesActions
};

const mapErrorStateToProps = (state: RootState) => ({
  error: state.error,
});

const dispatchErrorProps = {
  setError
};

const dispatchTagsProps = {
  retrieveAllTags,
}

const mapTagsToProps = (state: RootState) => ({
  tags: state.tags,
});

const mapUserAndTagsToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags,
})

export const Workspaces = connect(mapWorkspacesStateToProps, dispatchWorkspaceProps)(workspace)
export const WorkspaceCard = connect(mapUserStateToProps, dispatchWorkspaceProps)(workspaceCard);
export const Repositories = connect(mapUserStateToProps)(repositories);
export const EditRepoDialog = connect(mapTagsToProps, dispatchTagsProps)(editRepoDialog);
export const WorkspaceToolBox = connect(mapUserStateToProps, dispatchWorkspaceProps)(workspacetoolbox)
export const Banner = connect(mapUserStateToProps, dispatchUserProps)(banner)
export const Header = connect(mapUserStateToProps, { ...dispatchUserProps, ...dispatchDrawerProps })(header)
export const WorkspaceDrawer = connect(mapSelectedWorkspaceStateToProps, dispatchDrawerProps)(workspacedrawer) as any // any to fix weird type mapping error
export const WorkspaceInteractions = connect(mapSelectedWorkspaceStateToProps, dispatchWorkspaceProps)(workspaceInteractions) as any
export const WorkspaceEditor = connect(mapTagsToProps, dispatchTagsProps)(workspaceEditor)

export const App = connect(mapErrorStateToProps, null)(app)
export const ErrorDialog = connect(mapErrorStateToProps, dispatchErrorProps)(errorDialog)
const genericDispatch = (dispatch: Dispatch) => ({ dispatch: (action: AnyAction) => dispatch(action) });
export const WorkspaceFrame = connect(mapSelectedWorkspaceStateToProps, genericDispatch)(workspaceFrame)
export const WorkspacePage = connect(null, dispatchWorkspaceProps)(workspaceOpenPage);
export const RepositoryPage = connect(mapUserStateToProps)(repositoryPage)
export const RepositoriesPage = connect(mapUserAndTagsToProps, dispatchTagsProps)(repositoriesPage)
export const NewWorkspaceAskUser = connect(null, dispatchUserProps)(newWorkspaceAskUser)
export const ProtectedRoute = connect(mapUserStateToProps, dispatchUserProps)(protectedRoute)
