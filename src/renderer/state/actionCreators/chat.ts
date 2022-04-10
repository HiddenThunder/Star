const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const SUBSCRIBE_TO_TOPIC = 'SUBSCRIBE_TO_TOPIC';
const DECRYPT_CHANNEL_HISTORY = 'DECRYPT_CHANNEL_HISTORY';

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

const decryptHistoryInternal = (channel: string, chat: any) => {
  return {
    type: DECRYPT_CHANNEL_HISTORY,
    channel,
    chat,
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

export const decryptHistory = (
  ipc: any,
  channel: string,
  chat: any,
  key: string
) => {
  return async (dispatch: any) => {
    try {
      const newChat = ipc.sendSync('decrypt_messages', chat, key);
      if (newChat === -1) {
        throw new Error('Something went wrong. Try again later');
      }
      return dispatch(decryptHistoryInternal(channel, newChat));
    } catch (err) {
      console.error(err);
    }
  };
};
