const SET_CHANNEL = 'SET_CHANNEL';

// ACTION CREATORS
export const setChannel = (channel: any) => {
  return {
    type: SET_CHANNEL,
    channel,
  };
};
