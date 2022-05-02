import { privateKey, decryptMsg, encryptMsg } from '../crypto';
import { setFile } from './mfs';

// Default private key that is being used for all general channels
const PrivateKey =
  '0x2a1d5d208b3d551e8662bcf4bd12e66ab4e025ec8ef6e18cbc40c1594794652f';

console.log('Private key:', PrivateKey);

//* PUBSUB REGULAR STUFF
type Callback = (a: any) => void;

const LOBBY = 'lobby';

//* BASICS | STARTER

// Subsctibe to given topic(channel) with given callback
export const subscribe = async (
  node: any,
  topic: string,
  callback: Callback
) => {
  try {
    await setFile(node, topic);
    await node.pubsub.subscribe(topic, callback);
  } catch (err) {
    console.log('From pubsub subscribing', err);
  }
};

// Get list of peers in given topics
export const peers = (node: any, topic: string) => {
  try {
    return node.pubsub.peers(topic);
  } catch (err) {
    console.log('From pubsub peers', err);
    return -1;
  }
};

// Get list of topics
export const list = (node: any) => {
  try {
    return node.pubsub.ls();
  } catch (err) {
    console.log('From pubsub list', err);
    return -1;
  }
};

// Unsubscribe from given topic
export const unsubscribe = async (node: any, topic: string) => {
  try {
    await node.pubsub.unsubscribe(topic);
  } catch (err) {
    console.log('From pubsub unsibscribe', err);
  }
};

/** Encrypt message with default private key
 * and publish it
 */
export const publish = async (
  node: any,
  topic: string,
  id: string,
  imageHash: string,
  msg: string
) => {
  try {
    const encrypted = encryptMsg(PrivateKey, `${id}: ${msg}`);
    /** For pubsub we need to provide encoded string
     * But message is an object - we stringifying it
     */
    const message = new TextEncoder().encode(
      JSON.stringify({
        content: encrypted.toString('hex'),
        channel: topic,
        imageHash,
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

/** Publish message
 * without encryption
 */
export const publishWithoutEncryption = async (
  node: any,
  topic: string,
  id: string,
  imageHash: string,
  msg: string
) => {
  try {
    /** For pubsub we need to provide encoded string
     * But message is an object - we stringifying it
     */
    const message = new TextEncoder().encode(
      JSON.stringify({
        content: msg,
        channel: topic,
        imageHash,
        decrypted: true,
        sender: id,
      })
    );
    await node.pubsub.publish(topic, message);
  } catch (err) {
    console.log('Error from publshing', err);
  }
};

/** Encrypt message with random private key
 * and publish it
 */
export const publishp2pe = async (
  node: any,
  topic: string,
  id: string,
  imageHash: string,
  msg: string,
  key: string
) => {
  try {
    const encrypted = encryptMsg(key, `${id}: ${msg}`);
    /** For pubsub we need to provide encoded string
     * But message is an object - we stringifying it
     */
    const message = new TextEncoder().encode(
      JSON.stringify({
        content: encrypted.toString('hex'),
        channel: topic,
        imageHash,
        decrypted: false,
        sender: id,
      })
    );
    await node.pubsub.publish(topic, message);
    console.log(decryptMsg(encrypted, key));
  } catch (err) {
    console.log('Error from publshing', err);
  }
};

export default LOBBY;
