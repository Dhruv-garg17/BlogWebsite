import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddPost from './pages/AddPost';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './pages/Home';
import AdminRoute from './contexts/AdminRoute';

export default function App() {
  return (
    <div id="root">
        <Navbar />
        <main className="main-content"></main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
        <main/>
        <Footer/>
        </div>
      
  );
}
