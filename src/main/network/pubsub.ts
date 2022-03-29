export const echo = async (msg: any) => {
  const message = new TextDecoder().decode(msg.data);
  console.log(message);
};

export const subscribe = async (node: any, topic: string) => {
  try {
    await node.pubsub.subscribe(topic, echo);
  } catch (err) {
    console.log('From pubsub subscribing', err);
  }
};

export const peers = (node: any, topic: string) => {
  return node.pubsub.peers(topic);
};

export const list = (node: any) => {
  return node.pubsub.ls();
};

export const unsubscribe = async (node: any, topic: string) => {
  await node.pubsub.unsubscribe(topic, echo);
};

export const publish = async (node: any, topic: string, msg: string) => {
  try {
    await node.pubsub.publish(topic, msg);
  } catch (err) {
    console.log('Error from publshing', err);
  }
};
