const SET_CHANNEL = 'SET_CHANNEL';

// ACTION CREATORS
export const setChannel = (channel: string) => {
  return {
    type: SET_CHANNEL,
    channel,
  };
};
