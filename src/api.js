import axios from "axios";

const prod = !true;

export const getToken = async () => {
  const token = await localStorage.getItem("token");
  return token ? JSON.parse(token).accessToken : null;
};

export const socketUrl = prod
  ? "https://sv2be.onrender.com"
  : "http://localhost:6500";

export const baseUrl = prod
  ? "https://sv2be.onrender.com/api"
  : "http://localhost:6500/api";

export const LBAuth = axios.create({
  baseURL: baseUrl,
});

// Set up the interceptor
LBAuth.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
