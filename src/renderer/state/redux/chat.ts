// ACTION TYPES

const SUBSCRIBE_TO_TOPIC = 'SUBSCRIBE_TO_TOPIC';
const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const DECRYPT_CHANNEL_HISTORY = 'DECRYPT_CHANNEL_HISTORY';
const SET_LOCAL_HISTORY = 'SET_LOCAL_HISTORY';

// REDUCER
export default function chatReducer(chat: any = { lobby: [] }, action: any) {
  switch (action.type) {
    case SUBSCRIBE_TO_TOPIC:
      return Object.keys(chat).includes(action.channel)
        ? chat
        : { ...chat, [action.channel]: [] };
    case SEND_MESSAGE:
      return {
        ...chat,
        [action.message.channel]: [
          ...chat[`${action.message.channel}`],
          action.message,
        ],
      };
    case DECRYPT_CHANNEL_HISTORY:
      return {
        ...chat,
        [action.channel]: action.chat,
      };
    case DELETE_MESSAGE:
      return {
        ...chat,
        [action.message.channel]: chat[`${action.message.channel}`].filter(
          (msg: any) => msg.id !== action.messageId
        ),
      };
    case SET_LOCAL_HISTORY:
      return {
        ...chat,
        [action.channel]: action.messages,
      };

    default:
      return chat;
  }
}
