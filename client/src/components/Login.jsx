import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Alert, Button, Card } from 'react-bootstrap';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HOST = import.meta.env.VITE_HOST;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${HOST}/api/users/login`, { email, password });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <Card className="w-100" style={{ maxWidth: '400px' }}>
                <Card.Body className="p-3 p-md-4">
                    <div className="text-center mb-3">
                        <FaSignInAlt size={40} className="text-primary mb-2" />
                        <h3 className="mb-2">Login</h3>
                        <p className="text-muted small">Welcome back! Please enter your credentials.</p>
                    </div>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <FaEnvelope className="text-primary" />
                                </span>
                                <Form.Control
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-start-0"
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <FaLock className="text-primary" />
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-start-0"
                                />
                            </div>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-2 fw-bold mb-2"
                        >
                            Login
                        </Button>

                        <div className="text-center">
                            <Button 
                                variant="link" 
                                onClick={handleForgotPassword}
                                className="text-decoration-none p-0"
                            >
                                Forgot Password?
                            </Button>
                        </div>
                    </Form>

                    {message && <Alert variant="success" className="mt-3 text-center">{message}</Alert>}
                    {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;