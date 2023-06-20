import { connect } from "react-redux";

import { App as app } from "../App";
import { WorkspacesCards as workspace } from "./workspace/WorkspacesCards";
import { WorkspaceToolBox as workspacetoolbox } from "./workspace/NewWorkspaceToolBox";
import workspaceInteractions from "./workspace/drawer/WorkspaceInteractions";

import { Header as header } from "./header/Header";
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
import { userLogin, userLogout, userRegister } from "../store/actions/user";
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
  register: userRegister,
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

const mapAboutDialogToProps = (state: RootState) => ({
  aboutDialog: state.aboutDialog,
});

const dispatchAboutDialogProps = {
  closeDialog,
};
const dispatchMainMenuProps = {
  openDialog,
};

const mapAboutDialogAndUserToProps = (state: RootState) => ({
  aboutDialog: state.aboutDialog,
  user: state.user,
});

const dispatchAboutDialogAndUser = {
  openDialog,
  closeDialog,
  ...dispatchUserProps,
};

export const Workspaces = connect(
  mapWorkspacesStateToProps,
  dispatchWorkspaceProps
)(workspace);
export const WorkspaceCard = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(workspaceCard);
export const HomePage = connect(
  mapHomePageToProps,
  dispatchTagsProps
)(homePage);
export const EditRepoDialog = connect(mapRepositoriesPageToProps, {
  ...dispatchTagsProps,
  ...dispatchRepositoriesProps,
})(editRepoDialog);
export const WorkspaceToolBox = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(workspacetoolbox);

export const Header = connect(mapUserStateToProps, {
  ...dispatchUserProps,
  ...dispatchDrawerProps,
})(header);
export const WorkspaceDrawer = connect(
  mapSelectedWorkspaceStateToProps,
  dispatchDrawerProps
)(workspacedrawer) as any; // any to fix weird type mapping error
export const WorkspaceInteractions = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(workspaceInteractions);
export const WorkspaceEditor = connect(
  mapTagsToProps,
  dispatchTagsProps
)(workspaceEditor);

export const App = connect((state: RootState) => ({
  error: state.error,
  user: state.user,
}), null)(app);
export const AboutDialog = connect(
  mapAboutDialogToProps,
  dispatchAboutDialogProps
)(aboutDialog);
export const MainMenu = connect(null, dispatchMainMenuProps)(mainMenu);
const genericDispatch = (dispatch: Dispatch) => ({
  dispatch: (action: AnyAction) => dispatch(action),
});
export const WorkspaceFrame = connect(
  mapSelectedWorkspaceStateToProps,
  genericDispatch
)(workspaceFrame);
export const WorkspaceOpenPage = connect(
  null,
  dispatchWorkspaceProps
)(workspaceOpenPage);
export const WorkspacePage = connect(
  mapSelectedWorkspaceStateToProps,
  dispatchWorkspaceProps
)(workspacePage);
export const RepositoryPage = connect(mapUserStateToProps)(repositoryPage);
export const UserPage = connect(mapUserStateToProps)(userPage);
export const GroupsPage = connect(mapUserStateToProps)(UserGroupsPage);
export const RepositoriesPage = connect(mapRepositoriesPageToProps, {
  ...dispatchTagsProps,
  ...dispatchRepositoriesProps,
})(repositoriesPage);
export const NewWorkspaceAskUser = connect(
  null,
  dispatchUserProps
)(newWorkspaceAskUser);
export const ProtectedRoute = connect(
  mapUserStateToProps,
  dispatchUserProps
)(protectedRoute);

export const PageSider = connect(
  mapAboutDialogAndUserToProps,
  dispatchAboutDialogAndUser
)(MainDrawer);

export const WorkspaceActionsMenu = connect(
  mapUserStateToProps,
  dispatchWorkspaceProps
)(WorkspaceActionsMenuUnbound);
