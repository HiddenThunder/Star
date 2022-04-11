const { privateKey, decryptMsg, encryptMsg } = require('../crypto');

const PrivateKey =
  '0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f';

console.log('Private key:', PrivateKey);

//* PUBSUB REGULAR STUFF
type Callback = (a: any) => void;

const LOBBY = 'lobby';

//* BASICS | STARTER

export const subscribe = async (
  node: any,
  topic: string,
  callback: Callback
) => {
  try {
    await node.pubsub.subscribe(topic, callback);
  } catch (err) {
    console.log('From pubsub subscribing', err);
  }
};

export const peers = (node: any, topic: string) => {
  try {
    return node.pubsub.peers(topic);
  } catch (err) {
    console.log('From pubsub peers', err);
    return -1;
  }
};

export const list = (node: any) => {
  try {
    return node.pubsub.ls();
  } catch (err) {
    console.log('From pubsub list', err);
    return -1;
  }
};

export const unsubscribe = async (node: any, topic: string) => {
  try {
    await node.pubsub.unsubscribe(topic);
  } catch (err) {
    console.log('From pubsub unsibscribe', err);
  }
};

export const publish = async (
  node: any,
  topic: string,
  id: string,
  msg: string
) => {
  try {
    const encrypted = encryptMsg(PrivateKey, `${id}: ${msg}`);
    const message = new TextEncoder().encode(
      JSON.stringify({
        content: encrypted.toString('hex'),
        channel: topic,
        decrypted: false,
        sender: id,
      })
    );
    await node.pubsub.publish(topic, message);
    console.log(decryptMsg(encrypted, PrivateKey));
  } catch (err) {
    console.log('Error from publshing', err);
  }
};

export const publishToLocalId = async (
  node: any,
  topic: string,
  id: string,
  msg: string
) => {
  try {
    const message = new TextEncoder().encode(
      JSON.stringify({
        content: msg,
        channel: topic,
        decrypted: true,
        sender: id,
      })
    );
    await node.pubsub.publish(topic, message);
  } catch (err) {
    console.log('Error from publshing', err);
  }
};

export default LOBBY;
