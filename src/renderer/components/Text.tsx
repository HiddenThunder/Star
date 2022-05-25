import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/actionCreators';

const { ipc } = window.electron;

const Text = () => {
  const [localText, setLocalText] = useState('');
  const channel = useSelector((state) => state.channel);
  const profile = useSelector((state) => state.profile);

  const username = profile.username || undefined;
  const imageHash =
    profile.imageHash ||
    'bafybeib4sa3coc325mb2zmhpxbvphbjqhvwxn7jl3g26m3ha5l2t54mxme/mamimi.jpeg';

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
          channel.key,
          username,
          imageHash
        );
      } else {
        // If it is general chat the general key is used
        result = await ipc.sendSync(
          'publish_message',
          channel.topic,
          localText,
          undefined,
          username,
          imageHash
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
    <div id="text">
      <input
        id="textarea"
        value={localText}
        onChange={handleChangeText}
        onKeyPress={handleKeyPress}
      />
      <button id="send-message" type="button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
};

export default Text;
