// ACTION TYPES
const SET_PEER_LIST = 'SET_PEER_LIST';
const ADD_PEER = 'ADD_PEER';

// REDUCER
export default function peerListReducer(peers: any = [], action: any) {
  switch (action.type) {
    case SET_PEER_LIST:
      return action.peers;
    case ADD_PEER:
      return [...peers, action.peer];
    default:
      return peers;
  }
}
