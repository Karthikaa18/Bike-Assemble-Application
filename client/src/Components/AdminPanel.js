import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import { Container, Button, Box, TextField, Typography } from '@mui/material';

function AdminPanel() {
    const location = useLocation();
    const { username } = location.state || { username: 'User' };
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();
            navigate('/', { replace: true });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const handleLogout = () => {
        navigate('/', { replace: true });
    };

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [logs, setLogs] = useState([]);

    const handleFilter = async () => {
        if (!fromDate || !toDate) {
            alert('Please select both from and to dates.');
            return;
        }

        try {
            const response = await fetch('https://bike-assemble-application.onrender.com/filter-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromDate, toDate }),
            });

            const data = await response.json();
            if (response.ok) {
                setLogs(data.logs);
            } else {
                alert('Failed to retrieve data');
            }
        } catch (error) {
            console.error('Error during data retrieval:', error);
            alert('An error occurred while fetching data');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <UserInfo username={username} onLogout={handleLogout} />
            </Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Panel
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="To"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleFilter}
                    >
                        Filter
                    </Button>
                </Box>
                <Box>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Employee</th>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Production time</th> */}
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Number of Bikes assembled</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Production time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map((log, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.log_date}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.username}</td>
                                            {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.total_count}</td> */}
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.total_bikes}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.hours} hours {log.minutes} minutes</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '8px' }}>
                                            No records found for the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                </Box>
            </Box>
        </Container>
    );
}

export default AdminPanel;
