import { createStore } from 'redux';
import appReducer from './redux';

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

export default createStore(rootReducer, {});
