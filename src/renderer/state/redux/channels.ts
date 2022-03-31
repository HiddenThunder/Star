// ACTION TYPES

const SET_CHANNELS = 'SET_CHANNELS';
const DELETE_CHANNEL = 'DELETE_CHANNEL';

// REDUCER
export default function channelsReducer(channels: any = [], action: any) {
  switch (action.type) {
    case SET_CHANNELS:
      return action.channels;
    case DELETE_CHANNEL:
      return channels.filter((channel: any) => channel.id !== action.channelId);
    default:
      return channels;
  }
}
