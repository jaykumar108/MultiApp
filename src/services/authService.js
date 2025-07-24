
const API_BASE_URL = 'https://multi-app-backend.vercel.app/api/auth';
// const API_BASE_URL = 'http://localhost:5000/api/auth';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
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
  }
};

