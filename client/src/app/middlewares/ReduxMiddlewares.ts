import axios from 'axios';
import { logout } from '../reducers/AuthReducers'; // Assurez-vous que ce chemin est correct

let storeInstance: any = null;

export const setStore = (store: any) => {
  storeInstance = store;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    if (storeInstance.getState().auth.token) {
        const token = storeInstance.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Ajout de l'intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si l'erreur est 401, on déconnecte l'utilisateur
      storeInstance.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
