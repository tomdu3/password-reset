import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

const HOST = import.meta.env.VITE_HOST;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addAlert } = useAlert();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${HOST}/api/users/login`, { email, password });
            addAlert(res.data.message, 'success');
            login(email);
            navigate('/');
        } catch (err) {
            addAlert(err.response?.data?.message || 'An error occurred', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <Card className="w-100" style={{ maxWidth: '400px' }}>
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <FaSignInAlt size={40} className="text-primary mb-3" />
                        <h3 className="mb-2">Login</h3>
                        <p className="text-muted">Welcome back! Please enter your credentials.</p>
                    </div>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaEnvelope className="text-muted" />
                                </span>
                                <Form.Control
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaLock className="text-muted" />
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mb-3 py-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className="text-center">
                            <Button 
                                variant="link" 
                                onClick={() => navigate('/forgot-password')}
                                className="text-decoration-none p-0"
                            >
                                Forgot Password?
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;