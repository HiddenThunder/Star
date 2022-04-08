import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import icon from '../../assets/logo.png';
import Text from './components/Text';
import Peers from './components/Peers';
import Chat from './components/Chat';
import Channels from './components/Channels';
import { actionCreators } from './state/actionCreators';
import './App.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '60vh',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflowWrap: 'break-word',
  },
};

Modal.setAppElement('#root');

const Hello = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const key: string | null = useSelector((state) => state.channel.key);
  const channel = useSelector((state) => state.channel);

  const dispatch = useDispatch();
  const { setChannel, setChannelKey } = bindActionCreators(
    actionCreators,
    dispatch
  );

  useEffect(() => {
    setChannel({ topic: 'lobby', key: null });
  }, []);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <div className="overflow">Isert private key here</div>
        {key ? <h3>Key: {key} </h3> : <h3>key is not setted</h3>}
        <form>
          <input value={value} onChange={(evt) => setValue(evt.target.value)} />

          <button
            type="button"
            onClick={() => {
              setChannelKey(
                {
                  topic: channel.topic,
                  key: value,
                },
                channel.topic
              );
              setChannel({ topic: channel.topic, key: value });
              setValue('');
            }}
          >
            set
          </button>
          <button type="button" onClick={closeModal}>
            close
          </button>
        </form>
      </Modal>

      <div id="top">
        <span id="icon">
          <img src={icon} alt="ipfs logo" className="icon" />
        </span>

        <button id="key" type="button" onClick={openModal}>
          Set key
        </button>
      </div>

      <Channels />
      <Chat />
      <Peers />
      <Text />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
