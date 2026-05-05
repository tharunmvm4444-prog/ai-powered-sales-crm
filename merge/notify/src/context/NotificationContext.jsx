import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message) => {
        const newNotification = {
            id: Date.now(),
            message,
            timestamp: new Date().toLocaleString(),
            status: 'Email Sent'
        };
        // Newest at the top
        setNotifications((prev) => [newNotification, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
