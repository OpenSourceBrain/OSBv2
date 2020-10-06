import { RootState } from "./rootReducer";
import configureStore from './configureStore'

const initialState: RootState = {
  drawer: false,
  error: null,
  user: null,
  workspaces: null,
  models: null
};
const store = configureStore(initialState);

export default store;
