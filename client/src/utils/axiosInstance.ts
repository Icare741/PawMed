import axios from 'axios';
import { REACT_APP_API_URL } from '../config';
import { logout } from '../app/reducers/AuthReducers';
import { Store } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

let storeInstance: Store<RootState> | null = null;

export const setStore = (store: Store<RootState>) => {
  storeInstance = store;
};

const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use((config) => {
  console.log('storeInstance', storeInstance);
  if (storeInstance?.getState().auth.token) {
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
      console.log('Erreur 401 détectée, déconnexion de l\'utilisateur');
      // redirect to /login
      storeInstance?.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
