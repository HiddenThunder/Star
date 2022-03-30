import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/logo.png';
import './App.css';

const Hello = () => {
  return (
    <>
      <div id="channels" className="inline">
        <ul>
          <li>1ch</li>
          <li>2ch</li>
        </ul>
      </div>
      <div id="chat" className="inline">
        <p>Hello</p>
      </div>
      <div id="peers" className="inline">
        <ul>
          <li>1peer</li>
          <li>2peer</li>
        </ul>
      </div>
      <input id="textarea" />
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
