import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Navbar.css'
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Blogs</Link>
      {user ? (
        <>
          <Link 
            to="/add-post" 
            className={location.pathname === '/add-post' ? 'active' : ''}
          >
            Add Post
          </Link>
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Panel
            </Link>
          )}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link 
            to="/login" 
            className={location.pathname === '/login' ? 'active' : ''}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={location.pathname === '/register' ? 'active' : ''}
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}