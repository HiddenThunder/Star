const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const SUBSCRIBE_TO_TOPIC = 'SUBSCRIBE_TO_TOPIC';

// ACTION CREATORS

export const sendMessage = (message: any) => {
  return {
    type: SEND_MESSAGE,
    message,
  };
};

export const deleteMessage = (messageId: any) => {
  return {
    type: DELETE_MESSAGE,
    messageId,
  };
};

export const addChannel = (channel: string) => {
  return {
    type: SUBSCRIBE_TO_TOPIC,
    channel,
  };
};

// THUNK MIDDLEWARE

// export const sendMessage = (channel: string, message: any) => {
//   return async (dispatch: any) => {
//     try {
//       const result = await ipc.sendSync('publish_message', channel, message);
//       if (result === -1) {
//         throw new Error('something went wrong. try again');
//       }
//       return dispatch(sendMessageInrernal(`${result}: ${message}`));
//     } catch (error) {
//       console.error(error);
//     }
//   };
// };
