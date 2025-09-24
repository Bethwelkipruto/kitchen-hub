import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Mvule Catering</h3>
          <p>Experience exceptional culinary delights with our premium catering services. We bring flavor and elegance to every occasion.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Our Menu</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li>Corporate Catering</li>
            <li>Wedding Events</li>
            <li>Private Parties</li>
            <li>Meal Delivery</li>
            <li>Custom Menus</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 123 Culinary Street, Food City, FC 12345</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ info@mvulecatering.com</p>
          <p>🕒 Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Mvule Catering. All rights reserved. | Crafted with ❤️ for exceptional dining experiences.</p>
      </div>
    </footer>
  );
}

export default Footer;