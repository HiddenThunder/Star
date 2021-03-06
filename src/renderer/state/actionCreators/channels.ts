const SET_CHANNELS = 'SET_CHANNELS';
const DELETE_CHANNEL = 'DELETE_CHANNEL';
const SET_CHANNEL_KEY = 'SET_CHANNEL_KEY';

// ACTION CREATORS

export const setChannelsInternal = (channels: any) => {
  return {
    type: SET_CHANNELS,
    channels,
  };
};

export const deleteChannel = (channelId: any) => {
  return {
    type: DELETE_CHANNEL,
    channelId,
  };
};

export const setChannelKey = (channel: any, topic: string) => {
  return {
    type: SET_CHANNEL_KEY,
    topic,
    channel,
  };
};

// THUNK MIDDLEWARE

export const setChannels = (ipc: any) => {
  return async (dispatch: any) => {
    try {
      const channels = await ipc.sendSync('get_channels_list');
      if (channels === -1) {
        throw new Error('something went wrong. try again');
      }
      return dispatch(
        setChannelsInternal(
          channels.map((channel) => {
            return { topic: channel, key: null };
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };
};
