const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

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

// export const sendMessage = (message: any) => {
//   return sendMessageInternal(message);
// };

// export const deleteMessage = (messageId: any) => {
//   return (dispatch: any) => {
//     deleteMessageInternal(messageId);
//   };
// };
