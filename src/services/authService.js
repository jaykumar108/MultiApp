// Auth Service - Handles all authentication API calls
const API_BASE_URL = '/api/auth';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    // For cookie-based auth, we don't need to send token in headers
    // The browser will automatically send cookies
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
  
  // Store a flag in localStorage to indicate user is authenticated
  // The actual token is stored in HTTP-only cookies by the backend
  localStorage.setItem('authToken', 'authenticated');
  
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
  
  // Store a flag in localStorage to indicate user is authenticated
  // The actual token is stored in HTTP-only cookies by the backend
  localStorage.setItem('authToken', 'authenticated');
  
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
  
  // Store a flag in localStorage to indicate user is authenticated
  // The actual token is stored in HTTP-only cookies by the backend
  localStorage.setItem('authToken', 'authenticated');
  
  return data;
};

// Protected Routes (Authentication Required)

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
    // Always clear auth token on logout
    localStorage.removeItem('authToken');
    // Don't store user data in localStorage for security
  }
};

// Utility Functions

export const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {  
  return !!getStoredToken();
};

export const validateToken = async () => {
  try {
    const authFlag = getStoredToken();
    if (!authFlag) {
      return null;
    }

    // TODO: Replace with actual API call to validate token
    // const response = await fetch(`${API_BASE_URL}/validate-token`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    //   credentials: 'include',
    // });
    // const data = await handleResponse(response);
    // return data.user;

    // For now, return a mock user if auth flag exists
    // Simulate a small delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if auth flag exists and return user data
    if (authFlag === 'authenticated') {
      return {
        name: 'Jay Kumar Sharma',
        email: 'jaykumar732092@gmail.com',
        city: 'Darbhanga',
        mobile: '8736587634',
        role: 'user',
        isAuthenticated: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    // If token is invalid, clear it
    clearAuthData();
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  // Don't store user data in localStorage for security
};

// Future Protected Routes (Examples)
// Uncomment and implement as needed

/*
export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return await handleResponse(response);
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return await handleResponse(response);
};

export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return await handleResponse(response);
};
*/ 