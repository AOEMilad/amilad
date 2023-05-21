import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Family from './Family';
import Twitch from './Twitch';
import Temp from './Temp';
import './App.css';


const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">
                <img src={process.env.PUBLIC_URL + '/AOEMilad+PicOnly.png'} alt="Logo" />
              </Link>
            </li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/family">Family</Link></li>
            <li><Link to="/twitch">Twitch</Link></li>
            <li><Link to="/temp">Temp</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/family" element={<Family />} />
          <Route path="/twitch" element={<Twitch />} />
          <Route path="/temp" element={<Temp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

