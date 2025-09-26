import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:5555';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user && !isAdmin) {
      loadCartCount();
    }
  }, [isAuthenticated, user, isAdmin]);

  const loadCartCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/cart/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const totalItems = data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

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
              {!isAdmin && (
                <Link to="/cart" style={{ position: 'relative', display: 'inline-block' }}>
                  🛒 Cart
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              {!isAdmin && <Link to="/orders">My Orders</Link>}
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