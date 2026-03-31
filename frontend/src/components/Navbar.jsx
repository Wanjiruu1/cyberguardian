import React from 'react';
import { Link } from 'react-router-dom';

// Simple navigation bar for the app
function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#222',
      color: '#fff',
      padding: '1rem 2rem',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
        CyberGuardian
      </div>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1.5rem' }}>
          Screenshot Analyzer
        </Link>
        <Link to="/chatbot" style={{ color: '#fff', textDecoration: 'none' }}>
          Chatbot
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
