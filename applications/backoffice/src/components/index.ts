import { connect } from 'react-redux'
import { userLogin, userLogout, userRegister } from '../store/actions/user';
import { HomePage as homepage } from "../pages/HomePage"
import { RootState } from '../store/rootReducer'

const dispatchUserProps = {
  login: userLogin,
  logout: userLogout,
  register: userRegister
};

const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
});

export const HomePage = connect(mapUserStateToProps, dispatchUserProps)(homepage)
