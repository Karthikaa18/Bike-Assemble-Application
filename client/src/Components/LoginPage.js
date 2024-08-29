import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Box, Container, Alert } from '@mui/material';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bike, setBike] = useState('Bike1');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('https://bike-assemble-application.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, bike }),
            });

            const data = await response.json();

            if (response.ok) {
                if (username === 'administrator') {
                    navigate('/admin-panel', { state: { username }, replace: true });
                } else {
                    navigate('/bike', { state: { bike, username }, replace: true });
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred during login');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <Typography variant="h4" component="h2" gutterBottom>
                    Login Page
                </Typography>

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {username !== 'administrator' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Bike</InputLabel>
                        <Select
                            value={bike}
                            onChange={(e) => setBike(e.target.value)}
                            label="Bike"
                        >
                            <MenuItem value="Bike1">Bike1</MenuItem>
                            <MenuItem value="Bike2">Bike2</MenuItem>
                            <MenuItem value="Bike3">Bike3</MenuItem>
                        </Select>
                    </FormControl>
                )}

                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleLogin}
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>

                {message && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
}

export default LoginPage;
