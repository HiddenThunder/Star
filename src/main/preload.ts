const { contextBridge, ipcRenderer } = require('electron');
const store = require('../renderer/state');
const {
  sendMessage,
  addChannel,
  setTopicHistory,
} = require('../renderer/state/actionCreators/chat');
const {
  setChannelsInternal,
  setChannelKey,
} = require('../renderer/state/actionCreators/channels');
const { setChannel } = require('../renderer/state/actionCreators/channel');
const { setPeersInternal } = require('../renderer/state/actionCreators/peers');

const { setKey } = require('../renderer/state/actionCreators/key');

// This is known info

/** Private Key:
/*  0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f
/*  Public Key:
/*  024dc4941523c2a0af57528d18a86c35ad24d3e5966788e1807ffd83391a5f6668
*/

/**
 * So i can do
 * const { ipc, store } = window.electron in the renederer process!
 */
contextBridge.exposeInMainWorld('electron', {
  ipc: { ...ipcRenderer, on: ipcRenderer.on, once: ipcRenderer.once },
  store,
});

/**
 * Some IPC listeners..
 * I hope code here is self-explanatory
 */
ipcRenderer.on('set_topics', (event: any, topics: any) => {
  const channels = topics.map((channel: string) => {
    return {
      topic: channel,
      key: null,
    };
  });
  store.default.dispatch(setChannelsInternal(channels));
});

ipcRenderer.on('subscribe_to_topic', (event: any, topic: string) => {
  store.default.dispatch(addChannel(topic));
});

ipcRenderer.on('send_message', (event: any, msg: any) => {
  const message = JSON.parse(msg);

  if (!store.default.getState().peers.includes(message.sender)) {
    const peerList = ipcRenderer.sendSync(
      'get_peers_list',
      store.default.getState().channel.topic
    );
    store.default.dispatch(setPeersInternal(peerList));
  }
  store.default.dispatch(sendMessage(message));
});

ipcRenderer.on('get_key', (event: any) => {
  event.sender.send('send_key', store.default.getState().channel.key);
});

ipcRenderer.on('set_key', (event: any, topic: string, key: string) => {
  store.default.dispatch(setChannelKey({ topic, key, p2p: true }, topic));
});

ipcRenderer.on('set_history', (event: any, topic: string, history: string) => {
  const jsonHistory = JSON.parse(history);
  store.default.dispatch(setTopicHistory(topic, jsonHistory.messages));
  store.default.dispatch(setChannel(jsonHistory.channel));
});
