import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Helper to get token from localStorage
function getToken() {
  return localStorage.getItem("access_token");
}

// Get the current user's profile
export async function getMyProfile() {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/auth/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not fetch profile.";
  }
}

// Update the current user's profile (full_name, age_group)
export async function updateMyProfile(profileData) {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_BASE_URL}/auth/profile/me`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Could not update profile.";
  }
}
