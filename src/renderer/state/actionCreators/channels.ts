const { ipc } = window.electron;

const SET_CHANNELS = 'SET_CHANNELS';
const DELETE_CHANNEL = 'DELETE_CHANNEL';

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

// THUNK MIDDLEWARE

export const setChannels = () => {
  return async (dispatch: any) => {
    try {
      const channels = await ipc.sendSync('get_channels_list');
      if (channels === -1) {
        throw new Error('something went wrong. try again');
      }
      return dispatch(setChannelsInternal(channels));
    } catch (error) {
      console.error(error);
    }
  };
};
