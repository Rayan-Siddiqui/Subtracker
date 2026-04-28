// Shared axios instance for API requests
import axios from 'axios';

// Use the deployed API URL when available,
// otherwise fall back to local development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export default API;