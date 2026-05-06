import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// If you are using a physical device or emulator, "localhost" might not work.
// - Android Emulator: Use "http://10.0.2.2:8000/api/v1"
// - Physical Device: Use your machine's local IP (e.g., "http://192.168.1.10:8000/api/v1")
export const BASE_URL = "http://192.168.1.8:5000/api/v1"; 
export const IMAGE_BASE_URL = "http://192.168.1.5:5000"; // Assuming images are served from root or specific uploads folder

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for debugging and Authorization
api.interceptors.request.use((request) => {
  // Check the store for the token
  const token = useAuthStore.getState().token;

  if (token) {
    if (request.headers) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  }

  
  // Debugging request data safely
  // @ts-ignore - FormData and _parts handling
  const isFormData = request.data && (request.data instanceof FormData || request.data._parts);
  
  if (isFormData) {
    console.log('Starting Request (FormData):', request.url);
  } else {
    console.log('Starting Request:', request.url, JSON.stringify(request.data, null, 2));
  }
  
  return request;
});

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.log('Response Error:', JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
); 
