import axios from 'axios';

// Create a separate instance for the Notification Microservice
const notificationApi = axios.create({
    baseURL: import.meta.env.VITE_NOTIFICATION_API_URL, // Points to Port 8081
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR ---
notificationApi.interceptors.request.use(
    (config) => {
        // 1. Fetch the token
        const token = localStorage.getItem('token'); 
        
        // 2. Fetch the "user" object from local storage (This matches your AuthContext)
        const storedUserString = localStorage.getItem('user'); 
        let username = null;

        // 3. Parse the JSON string back into an object to grab the username
        if (storedUserString) {
            const userObj = JSON.parse(storedUserString);
            username = userObj.username; // Extracts the username from the object
        }

        // 4. Attach the JWT token for Spring Security
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 5. Attach the custom header required by the NotificationRestController
        if (username) {
            config.headers['X-Username'] = username;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default notificationApi;