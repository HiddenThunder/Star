// ACTION TYPES

const SET_CHANNEL = 'SET_CHANNEL';

// REDUCER
export default function channelReducer(channel: any = '', action: any) {
  switch (action.type) {
    case SET_CHANNEL:
      return action.channel;
    default:
      return channel;
  }
}
