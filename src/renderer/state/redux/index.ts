import { combineReducers } from 'redux';
import chatReducer from './chat';
import channelsReducer from './channels';
import peersReducer from './peers';
import keyReducer from './key';
import channelReducer from './channel';

const appReducer = combineReducers({
  chat: chatReducer,
  channels: channelsReducer,
  peers: peersReducer,
  key: keyReducer,
  channel: channelReducer,
});

export default appReducer;
