import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/", // Backend URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
