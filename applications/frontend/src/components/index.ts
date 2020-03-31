import { connect } from 'react-redux'

import { App as app } from './App'
import { Workspaces as workspace } from './workspace/Workspaces'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { WorkspaceDrawer as workspacedrawer } from './drawer/WorkspaceDrawer'

import { RootState } from '../store/rootReducer'
import { fetchWorkspaces } from '../store/reducers/workspaces'
import { fetchModels } from '../store/reducers/models';
import { fetchNWBFiles } from '../store/reducers/nwbfiles';
import { userLogin, userLogout } from '../store/reducers/user'
import { toggleDrawer } from '../store/reducers/drawer'

const mapWorkspaceStateToProps = (state: RootState) => ({
  workspaces: state.workspaces,
});
const dispatchWorkspaceProps = {
  onLoadWorkspaces: fetchWorkspaces,
  onLoadModels: fetchModels,
  onLoadNWBFiles: fetchNWBFiles
}

const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
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
