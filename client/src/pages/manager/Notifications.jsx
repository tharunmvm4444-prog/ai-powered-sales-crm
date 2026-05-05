import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('/api/notifications');
                setNotifications(res.data); // data is already formatted or raw objects
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotifications();
        // Optional: Poll every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <Sidebar />
            <div className="main">
                <Header />
                <div className="content-wrapper" style={{ padding: '20px' }}>
                    <div className="publications-content"> {/* Reusing similar class for layout if needed or custom */}
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
                </div>
            </div>
        </div>
    );
};

export default Notifications;
