// ACTION TYPES

const SET_PEERS = 'SET_PEERS';

// REDUCER
export default function peersReducer(peers: any = [], action: any) {
  switch (action.type) {
    case SET_PEERS:
      return action.peers;
    default:
      return peers;
  }
}
