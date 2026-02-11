const BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },
  
  // Mock login for demonstration
  login: async (username, password) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username && password) {
            localStorage.setItem('token', 'fake-jwt-token');
            resolve({ success: true, token: 'fake-jwt-token', user: { name: username } });
        } else {
            resolve({ success: false, message: 'Invalid credentials' });
        }
      }, 1000);
    });
  }
};
