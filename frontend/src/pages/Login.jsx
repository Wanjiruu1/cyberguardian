import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

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
      const res = await loginUser({ email, password });
      login(res.access_token); // Store token and update user state
      setSuccess('Login successful!');
      setEmail('');
      setPassword('');
      // Optionally redirect here
    } catch (err) {
      setError(err || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {success && <div style={{ color: 'green', marginTop: 16 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default Login;
