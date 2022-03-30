//* PUBSUB REGULAR STUFF

type Callback = (a: any) => void;

const LOBBY = 'lobby';

export const echo = async (msg: any) => {
  const message = new TextDecoder().decode(msg.data);
  console.log(message);
};

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
    await node.pubsub.unsubscribe(topic, echo);
  } catch (err) {
    console.log('From pubsub unsibscribe', err);
  }
};

export const publish = async (node: any, topic: string, msg: string) => {
  try {
    await node.pubsub.publish(topic, msg);
  } catch (err) {
    console.log('Error from publshing', err);
  }
};

export default LOBBY;
