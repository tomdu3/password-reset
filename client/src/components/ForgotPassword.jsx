import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Alert, Button, Card } from 'react-bootstrap';
import { FaLock, FaEnvelope } from 'react-icons/fa';

// Import the HOST variable from environment variables
const HOST = import.meta.env.VITE_HOST;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${HOST}/api/users/forgot-password`, { email });
            setMessage(res.data.message);
            setError('');
            setFormSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="w-100" style={{ maxWidth: '450px' }}>
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <FaLock size={50} className="text-primary mb-3" />
                        <h2 className="mb-3">Forgot Password?</h2>
                        <p className="text-muted">You can reset your password here.</p>
                    </div>
                    
                    {formSubmitted ? (
                        <Alert variant="success" className="text-center">
                            Reset token is generated and sent to {email}
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail" className="mb-4">
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
                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-2 fw-bold"
                            >
                                Send My Password
                            </Button>
                        </Form>
                    )}
                    {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;