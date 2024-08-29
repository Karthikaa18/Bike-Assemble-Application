import React from 'react';
import { Typography, Box } from '@mui/material';

function BikeInfo({ bike }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="p">
                You selected: <strong>{bike}</strong> to assemble
            </Typography>
        </Box>
    );
}

export default BikeInfo;
