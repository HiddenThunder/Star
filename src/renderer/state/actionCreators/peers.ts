const SET_PEERS = 'SET_PEERS';

// ACTION CREATORS

export const setPeersInternal = (peers: any) => {
  return {
    type: SET_PEERS,
    peers,
  };
};

// THUNK MIDDLEWARE

export const setPeers = (channel: string, ipc: any) => {
  return async (dispatch: any) => {
    try {
      const peers = await ipc.sendSync('get_peers_list', channel);
      if (peers === -1) {
        throw new Error('something went wrong. try again');
      }
      return dispatch(setPeersInternal(peers));
    } catch (error) {
      console.error(error);
    }
  };
};
