import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/logo.png';
import Text from './components/Text';
import Peers from './components/Peers';
import Chat from './components/Chat';
import Channels from './components/Channels';
import './App.css';

const Hello = () => {
  return (
    <>
      <div id="top">
        <span id="icon">
          <img src={icon} alt="ipfs logo" className="icon" />
        </span>

        <button id="key" type="button">
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
