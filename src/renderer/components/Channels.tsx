import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useEffect } from 'react';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Channels = () => {
  const channels = useSelector((state) => state.channels);

  const dispatch = useDispatch();
  const { setChannels, deleteChannel, setChannel } = bindActionCreators(
    actionCreators,
    dispatch
  );

  useEffect(() => {
    setChannels(ipc);
  }, []);

  const changeChannel = (channel: any) => {
    setChannel(channel);
  };

  return (
    <div id="channels" className="inline">
      <div className="header">
        <h3 className="header">Channels</h3>
      </div>
      <ul className="no-bullets">
        {channels.map((channel: string, index: any) => {
          return (
            <li
              className="item"
              key={index}
              channel={channel}
              onClick={() => changeChannel(channel)}
            >
              {channel.topic}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Channels;
