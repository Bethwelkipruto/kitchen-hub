import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-brand">Quick Bite</Link>
        
        <div className="nav-links">
          <Link to="/menu">Menu</Link>
          {isAuthenticated && (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">My Orders</Link>
              {(isAdmin || user?.username === 'admin') && (
                <Link to="/admin">Admin Dashboard</Link>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <span style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Welcome, {user?.username}!
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-small"
                style={{ marginLeft: '0.5rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-small">Login</Link>
              <Link to="/register" className="btn btn-secondary btn-small">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;