import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const Notifications = () => {
    const { notifications } = useNotifications();

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1>Manager Dashboard</h1>
                <Link to="/" className="back-link">Exit to Home</Link>
            </header>
            <div className="notifications-container">
                <h2>Recent Notifications</h2>
                {notifications.length === 0 ? (
                    <p>No notifications yet</p>
                ) : (
                    <div className="notification-list">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="notification-item">
                                <div className="notification-header">
                                    <span className="notification-status">{notif.status}</span>
                                    <span className="notification-time">{notif.timestamp}</span>
                                </div>
                                <p className="notification-message">{notif.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
