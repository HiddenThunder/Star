import path from 'path';
import os from 'os';
import log from 'electron-log';
import Ctl from 'ipfsd-ctl';

const port = 43134;

const server = Ctl.createServer(port, {
  type: 'go',
  ipfsHttpModule: require('ipfs-http-client'),
  ipfsBin: require('go-ipfs').path(),
});

let ipfsd: any = null;
let node: any = null;

export const startNode = async () => {
  try {
    //* starting server for go-ipfs as subprocess
    await server.start();
    //* controller for IPFS API
    console.log(path.join(os.homedir(), '.point'));
    ipfsd = await Ctl.createController({
      type: 'go',
      ipfsHttpModule: require('ipfs-http-client'),

      ipfsOptions: {
        EXPERIMENTAL: {
          ipnsPubsub: true,
        },
        repo: path.join(os.homedir(), '.point'),
        config: {
          Datastore: {
            StorageMax: '34GB',
            StorageGCWatermark: 99,
          },
          Bootstrap: [
            '/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
            '/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
          ],
        },
      },
    });

    node = ipfsd.api;
    const stats = await node.stats.repo();
    console.log(stats);
  } catch (err) {
    console.log(err);
    log.warn(err);
  }
  return node;
};

export const stopNode = async () => {
  await node.stop();
  await ipfsd.stop();
  await server.stop();
};
