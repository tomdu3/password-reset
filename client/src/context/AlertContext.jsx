import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const addAlert = (message, variant = 'success') => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, message, variant }]);
        
        setTimeout(() => {
            removeAlert(id);
        }, 3000);
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ addAlert }}>
            {children}
            <AlertContainer alerts={alerts} />
        </AlertContext.Provider>
    );
};

const AlertContainer = ({ alerts }) => {
    return (
        <div className="alert-container">
            {alerts.map(alert => (
                <div 
                    key={alert.id}
                    className={`alert alert-${alert.variant} alert-dismissible fade show`}
                    role="alert"
                >
                    {alert.message}
                </div>
            ))}
        </div>
    );
};

export const useAlert = () => useContext(AlertContext);