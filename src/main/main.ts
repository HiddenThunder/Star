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
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { randomBytes } from 'crypto';
import MenuBuilder from './menu';

import { resolveHtmlPath } from './util';
import {
  decryptMsg,
  privateKey,
  generateSharedSecret,
  generatePrivateKey,
} from './crypto';
import { startNode, stopNode } from './network';
import LOBBY, {
  subscribe,
  peers,
  list,
  publishWithoutEncryption,
  unsubscribe,
  publish,
  publishp2pe,
} from './network/pubsub';
import { setRootDir, saveHistory, fetchHistory, setFile } from './network/mfs';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// globals
let mainWindow: BrowserWindow | null = null;

// ipfs node
let node: any;

// randomly generated private key for ECDH
let privKey: string;

// your ipfs node peer id
let id: string;

// callback functions for pubsub
let peerConnecitonReceiver: any;
let peerConnecitonSender: any;
let echo: any;
let echop2pSender: any;
let echop2pReceiver: any;

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

  // CALLBACK FUNCTIONS FOR PUBSUB

  /**
   * Regular callback function
   * that decryptes message before pushing it to ui
   * because all messages are encrypted when going through pubsub
   * channels
   */
  echo = async (msg: any) => {
    mainWindow?.webContents.send('get_key');
    const messageNotParsed = new TextDecoder().decode(msg.data);
    /**
     * once here, not on
     * https://stackoverflow.com/questions/47597982/send-sync-message-from-ipcmain-to-ipcrenderer-electron
     */
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

  /**
   * ESTABLISH P2P ENCRIPTION
   * This is what is being done after peers created a
   * specific channel for themselves
   */

  /**
   * callback for private chat initiator
   * it'll be called only after second peer sends
   * message to the channel
   */
  echop2pSender = async (msg: any) => {
    const messageNotParsed = new TextDecoder().decode(msg.data);
    const message = JSON.parse(messageNotParsed);

    // Check if it is not our message
    if (message.sender !== id) {
      /**
       * This is public key that was send by other peer
       * for ECDH
       */
      const pubKey = message.content;
      const sharedSecret = generateSharedSecret(privKey, pubKey);
      console.log(`YOUR SHARED SECRET WITH ${message.sender}: ${sharedSecret}`);

      // Set shared secret as key for private channel
      mainWindow?.webContents.send('set_key', message.channel, sharedSecret);

      // Subscribe to this channel with another callback
      await unsubscribe(node, message.channel);
      await subscribe(node, message.channel, echo);
    }
  };

  /**
   * callback for private chat receiver
   * it'll be called first and it'll send
   * public key to the channel for ECDH
   */
  echop2pReceiver = async (msg: any) => {
    const messageNotParsed = new TextDecoder().decode(msg.data);
    const message = JSON.parse(messageNotParsed);

    // Check if it is not our message
    if (message.sender !== id) {
      /**
       * This is what was sent by initiator
       * at the very beginning of that channnel
       */
      const pubKey = message.content;

      // Generate new private key
      const PrivKey = generatePrivateKey();
      privKey = PrivKey.toHex();

      // send public key to the channel
      await publishWithoutEncryption(
        node,
        message.channel,
        id,
        'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
        PrivKey.publicKey.toHex()
      );

      // ECDH
      const sharedSecret = generateSharedSecret(privKey, pubKey);
      console.log(`YOUR SHARED SECRET WITH ${message.sender}: ${sharedSecret}`);
      mainWindow?.webContents.send('set_key', message.channel, sharedSecret);

      // Subscribe to this channel with another callbackS
      await unsubscribe(node, message.channel);
      await subscribe(node, message.channel, echo);
    }
  };

  /**
   * ESTABLISH P2P CONNECTION
   * This is what going on when peers haven't created
   * specific channel for themselves yet
   * so it's being send to the peer id of receiver (because receiver
   * is subscribed to themself)
   */

  /**
   * This is callback function for receiver
   * He is subscribed to his-id channel
   * and each time he receives messages to his channel
   * this callback is being invoked
   */
  peerConnecitonReceiver = async (msg: any) => {
    const messageNotParsed = new TextDecoder().decode(msg.data);
    const message = JSON.parse(messageNotParsed);

    // Check if it is not our message
    if (message.sender !== id) {
      try {
        let channelId: any;
        /**
         * Here we are generating a random 48 bytes
         * They'll be a name for private channel
         */
        randomBytes(48, async function (crypto_err, buffer) {
          channelId = buffer.toString('hex');
          // Subscribe to this new channel
          await subscribe(node, channelId, echop2pReceiver);
          // Update UI
          const topics = await list(node);
          mainWindow?.webContents.send('set_topics', topics);
          mainWindow?.webContents.send('subscribe_to_topic', channelId);
          /**
           * Send channel name to the id-topic
           * so the other peer will be able to subscribe
           */
          await publishWithoutEncryption(
            node,
            id,
            id,
            'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
            channelId
          );
        });
      } catch (err) {
        console.log(err);
        log.warn(err);
      }
    } else {
      mainWindow?.webContents.send('send_message', messageNotParsed);
    }
  };

  /**
   * This is callback for initiator or sender
   * sender is subscribed to the peer
   * he wants to start private chat with
   */
  peerConnecitonSender = async (msg: any) => {
    const messageNotParsed = new TextDecoder().decode(msg.data);
    const message = JSON.parse(messageNotParsed);
    try {
      // Check if it is not our message
      if (message.sender !== id) {
        // We are subsctibing to newly created private channel
        await subscribe(node, message.content, echop2pSender);

        // And unsubsctibing from this one
        await unsubscribe(node, message.sender);

        // Generating new random private key
        const PrivKey = generatePrivateKey();
        privKey = PrivKey.toHex();

        // Sending it for ECDH
        await publishWithoutEncryption(
          node,
          message.content,
          id,
          'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
          PrivKey.publicKey.toHex()
        );

        // Update UI
        const topics = await list(node);
        mainWindow?.webContents.send('subscribe_to_topic', message.content);
        mainWindow?.webContents.send('set_topics', topics);
        console.log('all good');
      }
    } catch (err) {
      console.log(err);
      log.warn(err);
    }
  };

  // IPFS STUFF INITIATING START

  // spawn the node
  node = await startNode();

  // create root dir for history
  await setRootDir(node);

  // subscribe to first general channel
  await subscribe(node, LOBBY, echo);
  const lobbyHistory = await fetchHistory(node, LOBBY);

  // update UI
  mainWindow?.webContents.send('subscribe_to_topic', LOBBY);
  if (lobbyHistory !== -1) {
    mainWindow?.webContents.send('set_history', LOBBY, lobbyHistory);
  }

  // Get our peer id
  const me = await node.id();
  id = me.id;

  /**
   * Subscribing to ourselves as a part of a protocol
   * notice here we use `peerConnecitonReceiver` callback
   */
  await subscribe(node, id, peerConnecitonReceiver);

  // update UI
  mainWindow?.webContents.send('subscribe_to_topic', id);

  // publish first messages to both channels
  await publish(
    node,
    LOBBY,
    id,
    'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
    `joined channel`
  );
  await publishWithoutEncryption(
    node,
    id,
    id,
    'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
    `I'm subscribed to myself`
  );

  // IPFS STUFF INITIATING END

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
 * listeners for IPC
 */

ipcMain.on('upload_pfp', async (event) => {
  try {
    const image = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    });

    const pathToFile = image.filePaths[0];
    const readStream = fs.createReadStream(pathToFile);

    const cid = await node.add(readStream, { pin: true });
    console.log(cid.cid.toString());
    event.returnValue = cid.cid.toString();
  } catch (err) {
    console.log(err);
    log.warn(err);
    event.returnValue = -1;
  }
});

// Call when want to start private chat with someone
ipcMain.on('connect_peers', async (event, peerId) => {
  try {
    // subsctibe to them with specific callback
    await subscribe(node, peerId, peerConnecitonSender);

    // publish first message to initiate their callback
    await publishWithoutEncryption(
      node,
      peerId,
      id,
      'bafybeiepwqesubkeths5n3uinxrq2ngulbdbsqrxxo33uiludsnbwten6y/milady.jpeg',
      "let's connect"
    );
    event.returnValue = 'All Good';
  } catch (err) {
    console.error(err);
    event.returnValue = -1;
  }
});

// Call when want to publish message
ipcMain.on(
  'publish_message',
  async (event, channel, message, key = null, username = id, imageHash) => {
    try {
      // Don't want to publish encrypted message to our channel
      if (channel !== id) {
        // encrypt with specified key
        if (key) {
          await publishp2pe(node, channel, username, imageHash, message, key);
          event.returnValue = 'All good';
        }
        // encrypt with general channel key
        else {
          await publish(node, channel, username, imageHash, message);
          event.returnValue = 'All good';
        }
      }
      // publish unincrypted to ourself
      else {
        await publishWithoutEncryption(
          node,
          channel,
          username,
          imageHash,
          message
        );
        event.returnValue = 'All good';
      }
    } catch (err) {
      event.returnValue = -1;
      console.log(err);
      log.warn(err);
    }
  }
);

// Call when want to get channel
ipcMain.on('get_channels_list', async (event) => {
  try {
    const topicsList = await list(node);

    // TEMPORARY SOLUTION TO CHANNELS UPDATE
    // it was done because atm here is no optimal schema design
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

// Call when want to get peers
ipcMain.on('get_peers_list', async (event, channel: string) => {
  try {
    event.returnValue = await peers(node, channel);
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

// Call when want to get decrypt message
ipcMain.on('decrypt_messages', async (event, messages: any, key: string) => {
  try {
    const decryptedMessages = messages.map((message: any) => {
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

// Call when user wants to save history locally
ipcMain.on('save-history', async (event, topic: string, history: any) => {
  try {
    await setFile(node, topic);
    await saveHistory(node, topic, history);
    event.returnValue = 'All good';
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

ipcMain.on('fetch-history', async (event, topic: string) => {
  try {
    const history = await fetchHistory(node, topic);
    if (history !== -1) {
      mainWindow?.webContents.send('set_history', topic, history);
    }
    event.returnValue = 'All good';
  } catch (err) {
    event.returnValue = -1;
    console.log(err);
    log.warn(err);
  }
});

/**
 * Add event listeners for app
 * just stop ipfs node before quit
 */

app.on('window-all-closed', async () => {
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
