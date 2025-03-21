import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const HOST = import.meta.env.VITE_HOST;

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await axios.get(`${HOST}/api/users/reset-password/${token}`);
                setIsValidToken(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid or expired reset token');
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setMessage('');
            return;
        }

        try {
            const res = await axios.post(`${HOST}/api/users/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage('');
        }
    };

    if (loading) {
        return (
            <Container className="mt-5">
            <p>Verifying reset token...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
        <h2>Reset Password</h2>

        {!isValidToken ? (
            <Alert variant="danger" className="mt-3">{error}</Alert>
        ) : (
            <>
            <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword" className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
            </Form.Group>
            <Button variant="primary" type="submit">
            Reset Password
            </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </>
        )}
        </Container>
    );
};

export default ResetPassword;
