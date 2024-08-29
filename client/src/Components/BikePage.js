import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BikeInfo from './BikeInfo';
import TimerButton from './TimerButton';
import BikeCount from './BikeCount';
import UserInfo from './UserInfo';
import { Container, Box, Tabs, Tab, TextField, Button, Typography } from '@mui/material';

function BikePage() {
    const location = useLocation();
    const { bike, username } = location.state || { bike: 'Bike1', username: 'User' };

    const [count, setCount] = useState(0);
    const [tab, setTab] = useState('bike-assembly');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [logs, setLogs] = useState([]);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerTime, setTimerTime] = useState(null);

    const timerActiveRef = useRef(isTimerRunning);
    timerActiveRef.current = isTimerRunning;

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

    const handleComplete = async () => {
        setCount(prevCount => prevCount + 1);
        setIsTimerRunning(false);

        try {
            const response = await fetch('http://localhost:5000/update-bike-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, bike }),
            });

            if (!response.ok) {
                throw new Error('Failed to update bike count');
            }
        } catch (error) {
            console.error('Error updating bike count:', error);
            alert('An error occurred.');
        }
    };

    const handleLogout = () => {
        navigate('/', { replace: true });
    };

    const handleTabChange = (event, newValue) => {
        if (timerActiveRef.current && newValue === 'dashboard') {
            const confirmSwitch = window.confirm("Bike assembly is going on. Are you sure you want to switch to the dashboard tab? The timer will continue once you return to the Bike Assembly tab");
            if (!confirmSwitch) {
                return;
            }
        }
        setTab(newValue);
    };

    const handleFilter = async () => {
        if (!fromDate || !toDate) {
            alert('Please select both from and to dates.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/filter-logs-dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromDate, toDate, username }),
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
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <UserInfo username={username} onLogout={handleLogout} />
            </Box>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ mb: 2 }}
            >
                <Tab label="Bike Assembly" value="bike-assembly" />
                <Tab label="Dashboard" value="dashboard" />
            </Tabs>
            {tab === 'bike-assembly' && (
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                    <BikeInfo bike={bike} />
                    <TimerButton bike={bike} onComplete={handleComplete} onTimerStart={() => setIsTimerRunning(true)} onSetTimerTime={setTimerTime} timerTime={timerTime} />
                    <BikeCount count={count} />
                </Box>
            )}
            {tab === 'dashboard' && (
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Filter Logs
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="From Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            sx={{ mr: 2 }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="To Date"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            sx={{ mr: 2 }}
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
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.total_bikes}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{log.hours} hours {log.minutes} minutes</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '8px' }}>
                                            No records found for the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Box>
                </Box>
            )}
        </Container>
    );
}

export default BikePage;
