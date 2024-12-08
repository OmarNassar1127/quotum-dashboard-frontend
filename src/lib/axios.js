import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://app.quotum.cloud/dashboard",
  // baseURL: "http://127.0.0.1:8000/dashboard",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Update active status if user info is in response
    if (response.data.user?.active !== undefined) {
      localStorage.setItem("active", response.data.user.active.toString());
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("active");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
