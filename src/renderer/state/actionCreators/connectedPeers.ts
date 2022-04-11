// ACTION TYPES
const SET_PEER_LIST = 'SET_PEER_LIST';
const ADD_PEER = 'ADD_PEER';

// ACTION CREATORS

export const setPeerList = (peers: any) => {
  return {
    type: SET_PEER_LIST,
    peers,
  };
};

export const addPeer = (peer: any) => {
  return {
    type: ADD_PEER,
    peer,
  };
};
