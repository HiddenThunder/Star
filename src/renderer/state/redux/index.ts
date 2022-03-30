import { combineReducers } from 'redux';
import chatReducer from './chat';

const appReducer = combineReducers({
  chat: chatReducer,
});

export default appReducer;
