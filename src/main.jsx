import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter
      basename={
        import.meta.env.DEV ? '' : '/100035-DowellScale-Function/'
      }
    >
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </HashRouter>
  </React.StrictMode>
);
