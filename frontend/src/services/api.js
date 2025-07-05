import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Set withCredentials to false to avoid CORS issues during development
  withCredentials: false,
  timeout: 10000, // Add a reasonable timeout
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure the token has the Bearer prefix
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      config.headers["Authorization"] = formattedToken;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error);

    if (error.response) {
      // Handle specific HTTP error codes
      if (error.response.status === 401) {
        // Handle unauthorized error - redirect to login
        console.log("Unauthorized access detected. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        console.log("Forbidden access detected. User lacks permission.");
      } else if (error.response.status === 500) {
        console.log("Server error detected.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log(
        "No response received from server. Network issue or server down."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
