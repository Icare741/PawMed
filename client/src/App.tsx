import React from 'react';
import './App.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoutes />
          <ToastContainer position="bottom-right" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
