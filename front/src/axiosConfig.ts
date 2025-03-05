import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the request method is NOT 'GET'
    if (error.config && error.config.method !== "get") {
      // Extract the error message
      const errorMessage =
        error.response?.data?.message || // API-specific error message
        error.response?.data || // Raw response data as fallback
        "An unexpected error occurred"; // Default message

      alert(`Error Message: ${errorMessage}`);
    }

    return Promise.reject(error);
  }
);
