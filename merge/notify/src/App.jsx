import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import EmailSender from './components/EmailSender';
import Notifications from './pages/Notifications';
import LandingPage from './pages/LandingPage';
import './App.css';

const AppContent = () => {
  const { notifications } = useNotifications();

  return (
    <Router>
      <div className="app-container">
        {/* Navbar removed for separation. Each page handles its own header if needed. */}
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/send-email" element={<EmailSender />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
