import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/actionCreators';

const Text = () => {
  const [localText, setLocalText] = useState('');

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
  const handleSendMessage = (event: any) => {
    sendMessage(localText);
  };

  return (
    <>
      <input id="textarea" value={localText} onChange={handleChangeText} />
      <button type="button" onClick={handleSendMessage}>
        Send
      </button>
    </>
  );
};

export default Text;
