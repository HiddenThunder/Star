/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { randomBytes } from 'crypto';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { decryptMsg, privateKey } from './crypto';
import { startNode, stopNode } from './network';
import LOBBY, {
  subscribe,
  peers,
  list,
  publishToLocalId,
  unsubscribe,
  publish,
} from './network/pubsub';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let node: any;
let pubKey: string;
let id: string;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  //* CALLBACK FUNCTIONS FOR PUBSUB

  const echo = async (msg: any) => {
    mainWindow?.webContents.send('get_key');
    const messageNotParsed = new TextDecoder().decode(msg.data);
    //* once here, not on
    //* https://stackoverflow.com/questions/47597982/send-sync-message-from-ipcmain-to-ipcrenderer-electron
    ipcMain.once('send_key', (event, key) => {
      if (key) {
        try {
          let message = JSON.parse(messageNotParsed);
          const decryptedMsg = decryptMsg(message.content, key);
          message.content = decryptedMsg;
          message.decrypted = true;
          message = JSON.stringify(message);
          mainWindow?.webContents.send('send_message', message);
        } catch (err) {
          console.log(err);
          mainWindow?.webContents.send('send_message', messageNotParsed);
        }
      } else {
        mainWindow?.webContents.send('send_message', messageNotParsed);
      }
    });
  };

  const peerConnecitonReceiver = async (msg: any) => {
    const messageNotParsed = new TextDecoder().decode(msg.data);
    const message = JSON.parse(messageNotParsed);
    if (message.id) {
      try {
        let channelId: any;
        randomBytes(48, function (crypto_err, buffer) {
          channelId = buffer.toString('hex');
        });

        console.log(channelId);
      } catch (err) {
        console.log(err);
        log.warn(err);
      }
    } else {
      console.log(message);
      mainWindow?.webContents.send('send_message', messageNotParsed);
    }
  };

  const peerConnecitonSender = async (msg: any) => {};

  //* IPFS STUFF BEGIN********* ------------------- //
  node = await startNode();
  await subscribe(node, LOBBY, echo);
  mainWindow?.webContents.send('subscribe_to_topic', LOBBY);
  const me = await node.id();
  id = me.id;
  await subscribe(node, id, peerConnecitonReceiver);
  mainWindow?.webContents.send('subscribe_to_topic', id);
  await publish(node, LOBBY, id, `joined channel`);
  await publishToLocalId(node, id, id, `I'm subscribed to myself`);
  //* IPFS STUFF END*********** ------------------- //

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', async () => {
    await stopNode();
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * IPC
 */

ipcMain.on('connect_peers', async (event, peerId) => {
  try {
    await subscribe(node, peerId, () => {});
    await publish(node, peerId, id, 'Message');
  } catch (err) {
    console.error(err);
    event.returnValue = -1;
  }
});

ipcMain.on('publish_message', async (event, channel, message, key: null) => {
  try {
    await publish(node, channel, id, message);
    event.returnValue = 'All good';
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

ipcMain.on('get_channels_list', async (event) => {
  try {
    const topicsList = await list(node);

    //* TEMPORARY SOLUTION TO CHANNELS UPDATE
    topicsList.forEach((topic: string) => {
      mainWindow?.webContents.send('subscribe_to_topic', topic);
    });

    event.returnValue = topicsList;
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

ipcMain.on('get_peers_list', async (event, channel: string) => {
  try {
    event.returnValue = await peers(node, channel);
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

ipcMain.on('decrypt_messages', async (event, messages: string, key: string) => {
  try {
    const decryptedMessages = messages.map((message) => {
      if (!message.decrypted) {
        message.content = decryptMsg(message.content, key);
        message.decrypted = true;
      }
      return message;
    });
    event.returnValue = decryptedMessages;
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  await stopNode();
  app.quit();
});

app.on('before-quit', async (event) => {
  await stopNode();
});

app.on('will-quit', async (event) => {
  await stopNode();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
