// ACTION TYPES

const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

// REDUCER
export default function chatReducer(chat: any = [], action: any) {
  switch (action.type) {
    case SEND_MESSAGE:
      return [...chat, action.message];
    case DELETE_MESSAGE:
      return chat.filter((msg: any) => msg.id !== action.messageId);
    default:
      return chat;
  }
}
