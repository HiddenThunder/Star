const { contextBridge, ipcRenderer } = require('electron');
const store = require('../renderer/state');
const { sendMessage } = require('../renderer/state/actionCreators/chat');
const { privateKey, decryptMsg, encryptMsg } = require('./crypto');

contextBridge.exposeInMainWorld('electron', {
  ipc: { ...ipcRenderer, on: ipcRenderer.on, once: ipcRenderer.once },
  store,
});

ipcRenderer.on('send_message', (event: any, id: string, msg: string) => {
  store.default.dispatch(
    sendMessage(encryptMsg(`${id}: ${msg}`, privateKey).toString())
  );
});
