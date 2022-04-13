import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Text = () => {
  const [localText, setLocalText] = useState('');
  const channel = useSelector((state) => state.channel);

  //* REDUX STUFF
  const dispatch = useDispatch();
  const { sendMessage, deleteMessage } = bindActionCreators(
    actionCreators,
    dispatch
  );
  //* EVENT HANDLERS
  const handleChangeText = (event: any) => {
    setLocalText(event.target.value);
  };

  const handleSendMessage = async (event: any) => {
    try {
      let result;
      if (channel.p2p) {
        // If it is private chat
        result = await ipc.sendSync(
          'publish_message',
          channel.topic,
          localText,
          channel.key
        );
      } else {
        // If it is general chat the general key is used
        result = await ipc.sendSync(
          'publish_message',
          channel.topic,
          localText
        );
      }
      if (result === -1) {
        throw new Error('Something went wrong. Please try again later');
      }
      setLocalText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      handleSendMessage(event);
    }
  };

  return (
    <>
      <input
        id="textarea"
        value={localText}
        onChange={handleChangeText}
        onKeyPress={handleKeyPress}
      />
      <button id="send-message" type="button" onClick={handleSendMessage}>
        Send
      </button>
    </>
  );
};

export default Text;
