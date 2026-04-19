// Create a reusable axios instance for API requests
import axios from 'axios';

// Use the backend base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Export the API instance
export default API;