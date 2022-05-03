// ACTION TYPES
const ADD_CHANNEL = 'ADD_CHANNEL';

// REDUCER
export default function loadedChannelsReducer(
  loadedChannels: any = [],
  action: any
) {
  switch (action.type) {
    case ADD_CHANNEL:
      return [...loadedChannels, action.topic];
    default:
      return loadedChannels;
  }
}
