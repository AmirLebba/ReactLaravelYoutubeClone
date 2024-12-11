// src/utils/auth.js

export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    return token !== null; // Return true if the token exists, otherwise false
  };
