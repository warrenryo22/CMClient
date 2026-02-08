import axios from "axios";
import qs from "qs";
import { useAuthStore } from "../zustand/authStore";

let DEFAULT_BASE_URL = "https://cmserver-production.up.railway.app/api";  

if(import.meta.env.DEV) DEFAULT_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: DEFAULT_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${DEFAULT_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;