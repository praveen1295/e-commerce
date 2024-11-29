import axios from "axios";

// axios.defaults.withCredentials = true;

const apiClient = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers.Accept = "*/*";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// apiClient.interceptors.request.use(config => {
//   // Assuming you have access to the cookie value
//   const authToken = 'your-auth-token';

//   // Set the cookie in the header
//   config.headers['Cookie'] = `auth_token=${authToken}`;

//   return config;
//  }, error => {
//   // Do something with request error
//   return Promise.reject(error);
//  });

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 errors globally, e.g., redirect to login
      // localStorage.removeItem("token");
      // window.location.href = "/login"; // Adjust according to your routing
    }
    return Promise.reject(error);
  }
);

export default apiClient;
