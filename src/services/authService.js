
// const API_BASE_URL = 'https://multi-app-backend.vercel.app/api/auth';
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Cookie management functions for user data only (not JWT tokens)
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        const cookieValue = c.substring(nameEQ.length, c.length);
        const decodedValue = decodeURIComponent(cookieValue);
        return JSON.parse(decodedValue);
      } catch (error) {
        console.error('Error parsing cookie:', error);
        return null;
      }
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('API response status:', response.status);

  const data = await response.json();
  console.log('API response data:', data);

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',

  };
};

// User data storage functions
export const storeUserData = (userData) => {
  try {
    setCookie('userData', userData, 7);
    console.log('User data stored in cookie:', userData);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = () => {
  try {
    return getCookie('userData');
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const clearUserData = () => {
  try {
    deleteCookie('userData');
    // Note: authToken is managed by the server as HTTP-only cookie
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

// Public Routes (No Authentication Required)

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', // Include cookies
  });

  const data = await handleResponse(response);

  return data;
};

export const loginWithPassword = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Include cookies
  });

  const data = await handleResponse(response);
  // Store user data in cookie for persistence
  if (data.user) {
    storeUserData(data.user);
  }
  return data;
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return await handleResponse(response);
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
    credentials: 'include', // Include cookies
  });

  const data = await handleResponse(response);
  // Store user data in cookie for persistence
  if (data.user) {
    storeUserData(data.user);
  }
  return data;
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include', // Include cookies
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear cookies
    clearUserData();
  }
};

export const validateToken = async () => {
  try {
    console.log('Validating token...');
    const response = await fetch(`${API_BASE_URL}/validate-token`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include', // Include HTTP-only cookies
    });

    console.log('Token validation response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token validation failed with status:', response.status, errorData);
      throw new Error(`HTTP ${response.status}: ${errorData.message || 'Token validation failed'}`);
    }

    const data = await response.json();
    console.log('Token validation successful:', data);

    // Update stored user data with fresh data from server
    if (data.user) {
      storeUserData(data.user);
    }
    return data.user;
  } catch (error) {
    console.error('Token validation failed:', error);
    // If token validation fails, clear user data
    clearUserData();
    return null;
  }
};

// Function to check if user is authenticated (for initial load)
export const checkAuthStatus = () => {
  const userData = getUserData();

  if (userData) {
    return userData;
  }

  return null;
};

