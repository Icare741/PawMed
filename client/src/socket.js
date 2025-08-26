import { io } from 'socket.io-client';
import { store } from './app/store';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://pawmed.fr' : 'http://localhost:3333';

// Créer le socket avec l'authentification
export const socket = io(URL, {
  transports: ['websocket'],
  path: '/socket.io',
  auth: {
    userId: store.getState().auth.user?.id
  }
});

// Mettre à jour l'authentification du socket quand l'utilisateur change
store.subscribe(() => {
  const userId = store.getState().auth.user?.id;
  if (userId) {
    socket.auth = { userId };
  }
});
