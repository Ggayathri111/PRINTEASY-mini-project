// App.js

import React from "react";

import Scan from "./scan"; // Make sure to use the correct path
import Homepage from "./Homepage"; 
import QRCodeComponent from './qrcode';
import QRScannerPage from "./scanner";
import QRCodePage from "./QRcodepage";
import Login from "./Login";
import Signup from "./Signup";
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
function App() {
  return (
    
    <AuthProvider>
    <Router>
      <Routes>
       <Route exact path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/scan"  element={<Scan />} />
        <Route path="/qr" element={<QRCodeComponent />}/>
        <Route path="/scancode" element={<QRScannerPage/>}/>
        <Route path="/qrscan" element={<QRCodePage/>}/>

      </Routes>
      </Router>
      </AuthProvider>
    );
}

export default App;
