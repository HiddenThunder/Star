import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useEffect } from 'react';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Channels = () => {
  const channels = useSelector((state) => state.channels);
  const loadedChannels = useSelector((state) => state.loadedChannels);

  const dispatch = useDispatch();
  const { setChannels, deleteChannel, setChannel, addLoadedChannel } =
    bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    setChannels(ipc);
  }, []);

  const changeChannel = (channel: any) => {
    setChannel(channel);
    console.log(loadedChannels);
    console.log(channel.topic);
    if (!loadedChannels.includes(channel.topic)) {
      const res = ipc.sendSync('fetch-history', channel.topic);
      if (res === -1) {
        console.error("History fetch wasn't successfull :((");
      } else {
        addLoadedChannel(channel.topic);
      }
    }
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
