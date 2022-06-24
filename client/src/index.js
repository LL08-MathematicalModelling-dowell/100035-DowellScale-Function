import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux'
import {store} from './redux/Store'
// import {store, persistor} from './redux/Store'
// import { PersistGate } from 'redux-persist/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      
        <App />
     
    </Provider>
  </React.StrictMode>
);
