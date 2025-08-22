import { connect } from "react-redux";

import { App as app } from "../App";
import { WorkspacesCards as workspace } from "./workspace/WorkspacesCards";
import { WorkspaceToolBox as workspacetoolbox } from "./workspace/NewWorkspaceToolBox";
import workspaceInteractions from "./workspace/drawer/WorkspaceInteractions";

import { Header as header } from "./header/Header";
import { Banner as banner } from "./header/Banner";
import { WorkspaceDrawer as workspacedrawer } from "./workspace/drawer/WorkspaceDrawer";
import { AboutDialog as aboutDialog } from "./dialogs/AboutDialog";
import { MainMenu as mainMenu } from "./menu/MainMenu";
import { WorkspaceFrame as workspaceFrame } from "./workspace/WorkspaceFrame";
import { ProtectedRoute as protectedRoute } from "./auth/ProtectedRouter";
import workspaceOpenPage from "../pages/WorkspaceOpenPage";
import workspacePage from "../pages/WorkspacePage";
import workspaceEditor from "./workspace/WorkspaceEditor";
import editRepoDialog from "../components/repository/EditRepoDialog";
import MainDrawer from "./MainDrawer/MainDrawer";

import { RootState } from "../store/rootReducer";
import * as WorkspacesActions from "../store/actions/workspaces";
import * as RepositoriesActions from "../store/actions/repositories";
import { userLogin, userLogout } from "../store/actions/user";
import { toggleDrawer } from "../store/actions/drawer";
import { setError } from "../store/actions/error";
import { openDialog, closeDialog } from "../store/actions/aboutdialog";
import { NewWorkspaceAskUser as newWorkspaceAskUser } from "./workspace/NewWorkspaceAskUser";
import { AnyAction, Dispatch } from "redux";

import { RepositoryPage as repositoryPage } from "../pages/RepositoryPage";

import { UserPage as userPage } from "../pages/UserPage";
import { UserGroupsPage as UserGroupsPage } from "../pages/UserGroupsPage";
import { RepositoriesPage as repositoriesPage } from "../pages/Repositories/index";
import { WorkspacesPage as homePage } from "../pages/WorkspacesPage";
import { retrieveAllTags, loadTags } from "../store/actions/tags";
import { WorkspaceCard as workspaceCard } from "./workspace/WorkspaceCard";
import WorkspaceActionsMenuUnbound from "./workspace/WorkspaceActionsMenu";

const mapWorkspacesStateToProps = (state: RootState) => ({
  user: state.user,
  counter: state.workspaces?.counter,
});

const mapSelectedWorkspaceStateToProps = (state: RootState) => ({
  workspace: state.workspaces?.selectedWorkspace,
  user: state.user,
});

export const dispatchWorkspaceProps = {
  login: userLogin,
  logout: userLogout,
  ...WorkspacesActions,
};

export const dispatchRepositoriesProps = {
  ...RepositoriesActions,
};

const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
  workspacesCounter: state.workspaces.counter,
});

const dispatchUserProps = {
  login: userLogin,
  logout: userLogout,
};

const dispatchDrawerProps = {
  onToggleDrawer: toggleDrawer,
  ...WorkspacesActions,
};



const dispatchErrorProps = {
  setError,
};

const dispatchTagsProps = {
  retrieveAllTags,
};

const mapTagsToProps = (state: RootState) => ({
  tags: state.tags,
});

const mapRepositoriesPageToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags,
  counter: state.repositories?.counter,
});

const mapHomePageToProps = (state: RootState) => ({
  user: state.user,
  tags: state.tags,
  counter: state.workspaces?.counter,
});

export const Workspaces = connect(
  mapWorkspacesStateToProps,
  dispatchWorkspaceProps
)(workspace);
export const WorkspaceCard = workspaceCard;
export const HomePage = homePage;
export const EditRepoDialog = editRepoDialog;
export const WorkspaceToolBox = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(workspacetoolbox);

export const Header = header;
export const WorkspaceDrawer = workspacedrawer;
export const WorkspaceInteractions = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(workspaceInteractions);
export const WorkspaceEditor = connect(
  mapTagsToProps,
  dispatchTagsProps
)(workspaceEditor);

export const App = app;
export const AboutDialog = aboutDialog;
export const MainMenu = mainMenu;
const genericDispatch = (dispatch: Dispatch) => ({
  dispatch: (action: AnyAction) => dispatch(action),
});
export const WorkspaceFrame = connect(
  mapSelectedWorkspaceStateToProps,
  genericDispatch
)(workspaceFrame);
export const WorkspaceOpenPage = workspaceOpenPage;
export const WorkspacePage = connect(
  mapSelectedWorkspaceStateToProps,
  dispatchWorkspaceProps
)(workspacePage);
export const RepositoryPage = repositoryPage;
export const UserPage = userPage;
export const GroupsPage = UserGroupsPage;
export const RepositoriesPage = connect(mapRepositoriesPageToProps, {
  ...dispatchTagsProps,
  ...dispatchRepositoriesProps,
})(repositoriesPage);
export const NewWorkspaceAskUser = newWorkspaceAskUser;
export const ProtectedRoute = protectedRoute;

// MainDrawer now uses Redux hooks for user and aboutDialog actions
export const PageSider = MainDrawer;

export const WorkspaceActionsMenu = WorkspaceActionsMenuUnbound;

// Components converted to use Redux hooks instead of connect
export const Banner = banner;
