import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import PostListing from './pages/PostListing';
import Navbar from './components/Navbar';
import MyListings from './pages/MyListings';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from'./pages/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<PostListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
