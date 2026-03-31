import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', marginLeft: 8 }}>
      Logout
    </button>
  );
}

export default LogoutButton;
