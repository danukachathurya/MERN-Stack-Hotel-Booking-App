import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Homescreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
