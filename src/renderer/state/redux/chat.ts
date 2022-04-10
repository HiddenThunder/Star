// ACTION TYPES

const SEND_MESSAGE = 'SEND_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

// REDUCER
export default function chatReducer(chat: any = { lobby: [] }, action: any) {
  switch (action.type) {
    case SEND_MESSAGE:
      return chat[`${action.message.channel}`]
        ? {
            ...chat,
            [action.message.channel]: [
              ...chat[`${action.message.channel}`],
              action.message,
            ],
          }
        : { ...chat, [action.message.channel]: [action.message] };
    case DELETE_MESSAGE:
      return {
        ...chat,
        [action.message.channel]: chat[`${action.message.channel}`].filter(
          (msg: any) => msg.id !== action.messageId
        ),
      };
    default:
      return chat;
  }
}
