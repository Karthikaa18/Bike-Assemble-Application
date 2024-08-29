import React from 'react';
import { Grid, Typography, Avatar, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function UserInfo({ username, onLogout }) {
    return (
        <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
                <Avatar
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5BSEPxHF0-PRxJlVMHla55wvcxWdSi8RU2g&s"
                    alt="User Icon"
                    sx={{ width: 70, height: 70 }}
                />
            </Grid>
            <Grid item>
                <Typography variant="h6">
                    {username}
                </Typography>
            </Grid>
            <Grid item>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={onLogout}
                    startIcon={<LogoutIcon />}
                >
                    Logout
                </Button>
            </Grid>
        </Grid>
    );
}

export default UserInfo;
