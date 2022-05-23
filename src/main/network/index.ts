import path from 'path';
import os from 'os';
import log from 'electron-log';
import Ctl from 'ipfsd-ctl';
import * as ipfsHttpModule from 'ipfs-http-client';

// "remote" ipfs server
const port = 43134;

const server = Ctl.createServer(port, {
  type: 'go',
  ipfsHttpModule,
  ipfsBin: require('go-ipfs').path(),
});

let ipfsd: any = null;
let node: any = null;

export const startNode = async () => {
  try {
    //* starting server for go-ipfs as subprocess
    await server.start();
    //* controller for IPFS API
    ipfsd = await Ctl.createController({
      type: 'go',
      ipfsHttpModule: require('ipfs-http-client'),

      ipfsOptions: {
        EXPERIMENTAL: {
          ipnsPubsub: true,
        },
        repo: path.join(os.homedir(), '.star'),
        config: {
          Datastore: {
            StorageMax: '34GB',
            StorageGCWatermark: 99,
          },
        },
      },
    });

    node = ipfsd.api;
    // check if everything is good
    const stats = await node.stats.repo();
    console.log(stats);
  } catch (err) {
    console.log(err);
    log.warn(err);
  }
  return node;
};

// before exit stop everything
export const stopNode = async () => {
  await node.stop();
  await ipfsd.stop();
  await server.stop();
};
