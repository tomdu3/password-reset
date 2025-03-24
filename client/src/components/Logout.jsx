import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import axios from 'axios';

const HOST = import.meta.env.VITE_HOST;

const Logout = () => {
    const navigate = useNavigate();
    const { addAlert } = useAlert();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post(`${HOST}/api/users/logout`);
                localStorage.removeItem('isAuthenticated');
                addAlert('You have been logged out successfully', 'success');
                navigate('/login');
            } catch (err) {
                addAlert(err.response?.data?.message || 'Logout failed', 'danger');
                navigate('/');
            }
        };

        logout();
    }, []);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <h3>Logging out...</h3>
            </div>
        </div>
    );
};

export default Logout;