import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

// Modal is a dialog window
import icon from '../../assets/logo.png';
import Text from './components/Text';
import Peers from './components/Peers';
import Chat from './components/Chat';
import Channels from './components/Channels';
import Key from './components/Key';
import Profile from './components/Profile';
import { actionCreators } from './state/actionCreators';
import './App.css';

const Hello = () => {
  const dispatch = useDispatch();
  const { setChannel, addLoadedChannel } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const channel = useSelector((state) => state.channel);

  useEffect(() => {
    if (!channel.key) {
      setChannel({ topic: 'lobby', key: null });
      addLoadedChannel('lobby');
    }
  }, []);

  return (
    <>
      <div className="mycolumn">
        <div id="top">
          <span id="icon">
            <img src={icon} alt="ipfs logo" className="icon" />
          </span>
          <Key />
          <Profile />
        </div>

        <div className="container">
          <Channels />
          <Chat />
          <Peers />
        </div>
        <Text />
      </div>
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
