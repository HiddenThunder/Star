import { combineReducers } from 'redux';
import chatReducer from './chat';
import channelsReducer from './channels';
import peersReducer from './peers';
import keyReducer from './key';
import channelReducer from './channel';
import peerListReducer from './connectedPeers';
import profileReducer from './profile';

const appReducer = combineReducers({
  chat: chatReducer,
  channels: channelsReducer,
  peers: peersReducer,
  key: keyReducer,
  channel: channelReducer,
  connectedPeers: peerListReducer,
  profile: profileReducer,
});

export default appReducer;
