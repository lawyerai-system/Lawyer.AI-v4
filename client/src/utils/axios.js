import axios from 'axios';
import toast from 'react-hot-toast';

const instance = axios.create({
    baseURL: '/', // Vite proxy handles /api requests to localhost:5000
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle Maintenance Mode
        if (error.response && error.response.data && error.response.data.maintenance) {
            // Trigger the central Maintenance Modal via custom event
            window.dispatchEvent(new CustomEvent('maintenance-alert', {
                detail: error.response.data.message
            }));

            // Still keep a toast as a secondary notification (optional, but requested to change UX)
            toast.error("Restricted Action: Maintenance Active", { id: 'maintenance-locked' });
        }

        // Handle 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access");
        }

        return Promise.reject(error);
    }
);

export default instance;
