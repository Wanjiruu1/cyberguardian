import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Register a new user
export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Registration failed.';
  }
}

// Login user and store JWT token
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const { access_token } = response.data;
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Login failed.';
  }
}

// Get current user info using JWT token
export async function getCurrentUser(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Could not fetch user info.';
  }
}
