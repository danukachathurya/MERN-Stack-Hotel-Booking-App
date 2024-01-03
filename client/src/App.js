// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Homescreen/>}/>
          <Route path='/book/:roomid/:fromdate/:todate' element={<Bookingscreen/>} />
          <Route path='/register' element={<Registerscreen/>} />
          <Route path='/login' element={<Loginscreen/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
