// ACTION TYPES

const SET_CHANNELS = 'SET_CHANNELS';
const DELETE_CHANNEL = 'DELETE_CHANNEL';
const SET_CHANNEL_KEY = 'SET_CHANNEL_KEY';

// REDUCER
export default function channelsReducer(channels: any = [], action: any) {
  switch (action.type) {
    case SET_CHANNELS:
      return action.channels;
    case SET_CHANNEL_KEY:
      return channels.map((channel: any, index: any) => {
        return channel.topic === action.topic ? action.channel : channel;
      });
    case DELETE_CHANNEL:
      return channels.filter((channel: any) => channel.id !== action.channelId);
    default:
      return channels;
  }
}
