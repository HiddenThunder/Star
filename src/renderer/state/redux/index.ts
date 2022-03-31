import { combineReducers } from 'redux';
import chatReducer from './chat';
import channelsReducer from './channels';
import peersReducer from './peers';

const appReducer = combineReducers({
  chat: chatReducer,
  channels: channelsReducer,
  peers: peersReducer,
});

export default appReducer;
