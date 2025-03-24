import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';
import { FaKey, FaLock, FaRedo } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

const HOST = import.meta.env.VITE_HOST;

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addAlert } = useAlert();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`${HOST}/api/users/reset-password/${token}`);
                setIsValidToken(true);
            } catch (err) {
                setIsValidToken(false);
                setTimeout(() => {
                    navigate('/forgot-password');
                }, 5000);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addAlert("Passwords do not match", 'danger');
            return;
        }

        try {
            const res = await axios.post(`${HOST}/api/users/reset-password/${token}`, { password });
            addAlert(res.data.message, 'success');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            addAlert(err.response?.data?.message || 'An error occurred', 'danger');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card className="w-100" style={{ maxWidth: '450px' }}>
                    <Card.Body className="p-4 p-md-5 text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Verifying reset token...</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="w-100" style={{ maxWidth: '450px' }}>
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <FaKey size={50} className="text-primary mb-3" />
                        <h2 className="mb-3">Reset Password</h2>
                        <p className="text-muted">Create a new password for your account</p>
                    </div>
                    
                    {!isValidToken ? (
                        <div className="text-center text-danger alert alert-danger">Invalid or expired reset token. Redirecting...</div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formPassword" className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <FaLock className="text-primary" />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="New password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-start-0"
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group controlId="formConfirmPassword" className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <FaLock className="text-primary" />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="border-start-0"
                                    />
                                </div>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-2 fw-bold"
                            >
                                <FaRedo className="me-2" />
                                Reset Password
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResetPassword;