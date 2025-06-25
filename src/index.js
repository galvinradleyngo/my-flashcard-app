import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This file won't exist yet, but it's common to reference it
import App from './App'; // This file will be created next

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
