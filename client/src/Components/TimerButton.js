import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function TimerButton({ bike, onComplete, onTimerStart, onSetTimerTime, timerTime }) {
    const [timeLeft, setTimeLeft] = useState(timerTime || null);
    const [timerActive, setTimerActive] = useState(timerTime !== null);

    const timeMappings = {
        Bike1: 50 * 60, 
        Bike2: 60 * 60, 
        Bike3: 80 * 60,
    };

    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            const intervalId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                onSetTimerTime((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            setTimeLeft(null);
            onSetTimerTime(null); 
            onComplete();  
        }
    }, [timerActive, timeLeft, onComplete, onSetTimerTime]);

    const handleClick = () => {
        if (!timerActive) {
            const initialTime = timeMappings[bike];
            setTimeLeft(initialTime);
            onSetTimerTime(initialTime);
            setTimerActive(true);
            onTimerStart();
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Button variant="contained" color="primary" onClick={handleClick} disabled={timerActive}>
            {timerActive ? `${formatTime(timeLeft)} minutes left for Bike Assembly` : 'Start Assembly'}
        </Button>
    );
}

export default TimerButton;
