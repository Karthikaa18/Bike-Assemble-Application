import React from 'react';
import { Typography } from '@mui/material';

function BikeCount({ count }) {
    return (
        <Typography variant="h6" component="p" sx={{ mt: 2 }}>
            Bike Assembly Count: {count}
        </Typography>
    );
}

export default BikeCount;
