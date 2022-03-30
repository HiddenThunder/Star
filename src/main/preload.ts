const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipc: { ...ipcRenderer, on: ipcRenderer.on, once: ipcRenderer.once },
});
