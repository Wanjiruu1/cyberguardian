import React, { useState } from 'react';
import { registerUser } from '../services/authService';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Simple email format validation
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Validate before submit
  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ full_name: fullName, email, password });
      setSuccess('Registration successful! You can now log in.');
      setFullName('');
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name</label><br />
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
            disabled={loading}
          />
          {emailError && <div style={{ color: 'red', fontSize: 13 }}>{emailError}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
            disabled={loading}
          />
          {passwordError && <div style={{ color: 'red', fontSize: 13 }}>{passwordError}</div>}
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 16 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Register;
