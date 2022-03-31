import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from './redux';

const { ipc } = window.electron;

/** I wrap the entire redux store in a root reducer with a special
 * action, RESET_STORE. It calls application's reducer with
 * state = undefined. This will trigger each of our sub-reducers
 * to reset back to their initial state. This will come in
 * handy when we need to reset redux store in between tests.
 */
const RESET_STORE = 'RESET_STORE';

export const resetStore = () => ({ type: RESET_STORE });

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    const newState = undefined;
    return appReducer(newState, action);
  }
  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware.withExtraArgument(ipc))
);
