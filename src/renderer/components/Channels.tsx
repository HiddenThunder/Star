import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useEffect } from 'react';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Channels = () => {
  const channels = useSelector((state) => state.channels);

  const dispatch = useDispatch();
  const { setChannels, deleteChannel } = bindActionCreators(
    actionCreators,
    dispatch
  );

  useEffect(() => {
    setChannels(ipc);
  }, []);

  return (
    <div id="channels" className="inline">
      <h3 className="header">Channels</h3>
      <ul className="no-bullets">
        {channels.map((channel: any, index: any) => {
          return (
            <li className="item" key={index}>
              {channel}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Channels;
