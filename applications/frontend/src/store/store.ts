import { RootState } from "./rootReducer";
import configureStore from './configureStore'

const initialState: RootState = {
  drawer: false,
  user: null,
  workspaces: null,
  models: null,
  nwbfiles: null
};
const store = configureStore(initialState);

export default store
