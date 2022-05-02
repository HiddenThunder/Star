import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useEffect } from 'react';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Chat = () => {
  const channel = useSelector((state) => state.channel);
  const topic = channel.topic ? channel.topic : 'lobby';
  const messages = useSelector((state) => state.chat[topic]);

  const dispatch = useDispatch();
  const { decryptHistory } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    if (channel.key) {
      decryptHistory(ipc, channel.topic, messages, channel.key);
    }
  }, [channel.key]);

  const handleSave = async () => {
    try {
      const history = {
        messages,
        channel,
      };

      const res = ipc.sendSync('save-history', topic, JSON.stringify(history));
      if (res === -1) {
        throw new Error('Something went wrong. Try again later');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div id="chat" className="inline">
        <h3 className="header">Messages</h3>
        <ul className="no-bullets">
          {messages.map((message: any, index: any) => {
            return (
              <li className="item" key={index}>
                <img
                  className="pfp-chat"
                  src={`https://ipfs.io/ipfs/${message.imageHash}`}
                  alt="pfp"
                />
                {message.content}
              </li>
            );
          })}
        </ul>
        <button type="button" className="history-btn" onClick={handleSave}>
          Save History
        </button>
      </div>
    </>
  );
};

export default Chat;
