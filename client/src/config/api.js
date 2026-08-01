import axios from 'axios';

// In development (npm run dev), always hit local Node server on http://localhost:3000
// In production (npm run build), hit the deployed Render URL
const baseURL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : (import.meta.env.VITE_BASE_URL || 'https://react-project-ams6.onrender.com');

const api = axios.create({
    baseURL
});

console.log('API Base URL:', baseURL);

export default api;
