import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaUser, FaUserPlus, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

const HOST = import.meta.env.VITE_HOST;

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { addAlert } = useAlert();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            addAlert('Passwords do not match', 'danger');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${HOST}/api/users/signup`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            addAlert(res.data.message, 'success');
            navigate('/login');
        } catch (err) {
            addAlert(err.response?.data?.message || 'Failed to create account', 'danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
            <Card className="w-100" style={{ maxWidth: '400px' }}>
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <FaUserPlus size={40} className="text-primary mb-3" />
                        <h3 className="mb-2">Create Account</h3>
                        <p className="text-muted">Get started by creating your account</p>
                    </div>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaUser className="text-muted" />
                                </span>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaEnvelope className="text-muted" />
                                </span>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaLock className="text-muted" />
                                </span>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Form.Text className="text-muted">
                                Must be 6+ chars with letters, numbers, and special chars
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <FaKey className="text-muted" />
                                </span>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
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
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>

                        <div className="text-center">
                            <p className="text-muted mb-0">
                                Already have an account?{' '}
                                <Button 
                                    variant="link" 
                                    onClick={() => navigate('/login')}
                                    className="text-decoration-none p-0"
                                >
                                    Login here
                                </Button>
                            </p>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Signup;