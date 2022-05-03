// ACTION TYPES

const ADD_CHANNEL = 'ADD_CHANNEL';

// ACTION CREATORS

export const addLoadedChannel = (topic: string) => {
  return {
    type: ADD_CHANNEL,
    topic,
  };
};
