const { contextBridge, ipcRenderer } = require('electron');
const store = require('../renderer/state');
const { sendMessage } = require('../renderer/state/actionCreators/chat');
const { privateKey, decryptMsg, encryptMsg } = require('./crypto');

/** Private Key:
/*  0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f
/*  Public Key:
/*  024dc4941523c2a0af57528d18a86c35ad24d3e5966788e1807ffd83391a5f6668
*/

contextBridge.exposeInMainWorld('electron', {
  ipc: { ...ipcRenderer, on: ipcRenderer.on, once: ipcRenderer.once },
  store,
});

ipcRenderer.on('send_message', (event: any, id: string, msg: string) => {
  store.default.dispatch(
    sendMessage(encryptMsg(`${id}: ${msg}`, privateKey).toString())
  );
});
