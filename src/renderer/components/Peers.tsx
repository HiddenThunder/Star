import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useEffect } from 'react';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Peers = () => {
  const peers = useSelector((state) => state.peers);

  const dispatch = useDispatch();
  const { setPeers } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    setPeers('lobby', ipc);
  }, []);

  const subscribeToPeer = (peerId: string) => {
    const response = ipc.sendSync('connect_peers', peerId);
    if (response === -1) {
      throw new Error('Something went wrong. Try again later');
    }
  };

  return (
    <div id="peers" className="inline">
      <h3 className="header">Peers</h3>
      <ul className="no-bullets">
        {peers.map((peer: string, index: any) => {
          return (
            <li
              className="item"
              key={index}
              onClick={() => subscribeToPeer(peer)}
            >
              {peer}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Peers;
