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
import os from 'os';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { CID } from 'multiformats/cid';
import * as Ctl from 'ipfsd-ctl';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const port = 9090;

const server = Ctl.createServer(
  port,
  {
    ipfsHttpModule: require('ipfs-http-client'),
  },
  {
    go: {
      ipfsBin: require('go-ipfs').path(),
    },
  }
);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let ipfsNode: any;
let ipfsd: any;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

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

  try {
    //* starting server for go-ipfs as subprocess
    await server.start();
    //* controller for IPFS API

    ipfsd = await Ctl.createController({
      remote: false,
      ipfsHttpModule: require('ipfs-http-client'),
      ipfsBin: require('go-ipfs')
        .path()
        .replace('app.asar', 'app.asar.unpacked'),
      endpoint: `http://localhost:${port}`,
      ipfsOptions: {
        repo: path.join(os.homedir(), '.point'),
        config: {
          Datastore: {
            GCPeriod: '1h',
            StorageGCWatermark: `99`,
            StorageMax: '350GB',
          },
        },
      },
    });

    ipfsNode = ipfsd.api;
    const id = await ipfsNode.id();
    console.log(id);
    //* Create local folder for MFS
    try {
      await ipfsNode.files.mkdir('/');
      console.log('Congrats! Directory is created');
    } catch (er) {
      console.log('Local directory already created');
    }
  } catch (err) {
    console.log(err);
    log.warn(err);
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
    },
  });

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
    await ipfsNode.stop();
    await ipfsd.stop();
    await server.stop();
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
 * Add event listeners...
 */

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  await ipfsNode.stop();
  await ipfsd.stop();
  await server.stop();
  app.quit();
});

app.on('before-quit', async (event) => {
  await ipfsNode.stop();
  await ipfsd.stop();
  await server.stop();
});

app.on('will-quit', async (event) => {
  await ipfsNode.stop();
  await ipfsd.stop();
  await server.stop();
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
