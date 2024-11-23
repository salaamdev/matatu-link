// matatu-link-mobile/src/api/config.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's IP address
const API_BASE_URL = 'http://192.168.0.198:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set or remove the Authorization token
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('userToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('userToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;