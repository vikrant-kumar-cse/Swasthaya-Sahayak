import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Add Authorization token for each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic when Access Token expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and retry not done yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get("http://localhost:5000/auth/refreshToken", {
          withCredentials: true,
        });

        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          // set new token to header
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token:", err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
