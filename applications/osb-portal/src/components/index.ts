import { connect } from 'react-redux'
import Keycloak from 'keycloak-js';

import store from '../store/store';

import { App as app } from './App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './drawer/WorkspaceDrawer'

import { RootState } from '../store/rootReducer'
import { fetchWorkspacesAction } from '../store/actions/workspaces'
import { fetchModelsAction } from '../store/actions/models';
import { fetchNWBFilesAction } from '../store/actions/nwbfiles';
import { userLogin, userLogout } from '../store/actions/user'
import { toggleDrawer } from '../store/actions/drawer'

const keycloak = Keycloak('/keycloak.json');
keycloak.onAuthSuccess = () => {
  keycloak.loadUserInfo().then((userInfo: any) => {
    store.dispatch(userLogin({
        id: userInfo.sub,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        emailAddress: userInfo.email
      })
    );
  });
};
keycloak.init({
  onLoad: 'check-sso'
});

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

export const Workspaces = connect(mapWorkspaceStateToProps, dispatchWorkspaceProps)(workspace)
export const Banner = connect(mapUserStateToProps)(banner)
export const Header = connect(mapUserStateToProps, {...dispatchUserProps, ...dispatchDrawerProps})(header)
export const WorkspaceDrawer = connect(mapDrawerStateToProps, dispatchDrawerProps)(workspacedrawer)
export const App = connect(mapWorkspaceStateToProps, dispatchWorkspaceProps)(app)
