const API_BASE_URL = 'https://multi-app-backend.vercel.app/api/todos';
// const API_BASE_URL = '/api/todos';
// const API_BASE_URL='http://localhost:5000/api/todos';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Get auth token from cookie
const getAuthToken = () => {
  const nameEQ = "authToken=";
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
        console.error('Error parsing auth token:', error);
        return null;
      }
    }
  }
  return null;
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Create new todo
export const createTodo = async (todoData) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(todoData),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Get todos with filtering and pagination
export const getTodos = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add all filter parameters
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });

  const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams.toString()}` : API_BASE_URL;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Get todo statistics
export const getTodoStats = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });

  const url = queryParams.toString() ? `${API_BASE_URL}/stats?${queryParams.toString()}` : `${API_BASE_URL}/stats`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Get single todo by ID
export const getTodoById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Update todo
export const updateTodo = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Delete todo
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  return await handleResponse(response);
};

// Toggle todo completion status
export const toggleTodoStatus = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  return await handleResponse(response);
}; 