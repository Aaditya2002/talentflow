import React from 'react';
import { Box, Paper, Typography, Divider, Switch, FormGroup, FormControlLabel, TextField } from '@mui/material';

function Settings() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Settings
            </Typography>

            <Paper sx={{ p: 3 }}>
                {/* Notifications Settings */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Notifications
                </Typography>
                <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Email notifications for new candidates"
                    />
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Resume processing alerts"
                    />
                    <FormControlLabel 
                        control={<Switch />} 
                        label="Weekly recruitment summary"
                    />
                </FormGroup>

                <Divider sx={{ my: 3 }} />

                {/* AI Analysis Settings */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    AI Analysis Preferences
                </Typography>
                <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Enable AI-powered resume screening"
                    />
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Automatic skill matching"
                    />
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Experience level verification"
                    />
                </FormGroup>

                <Divider sx={{ my: 3 }} />

                {/* Company Information */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Company Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
                    <TextField
                        label="Company Name"
                        defaultValue="TalentFlow Inc."
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Email Domain"
                        defaultValue="@talentflow.com"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Default Job Location"
                        defaultValue="San Francisco, CA"
                        variant="outlined"
                        fullWidth
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Integration Settings */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Integrations
                </Typography>
                <FormGroup>
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="LinkedIn Integration"
                    />
                    <FormControlLabel 
                        control={<Switch defaultChecked />} 
                        label="Google Calendar"
                    />
                    <FormControlLabel 
                        control={<Switch />} 
                        label="Slack Notifications"
                    />
                </FormGroup>
            </Paper>
        </Box>
    );
}

export default Settings; 