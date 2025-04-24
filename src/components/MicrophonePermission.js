import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import { Mic as MicIcon } from '@mui/icons-material';

const MicrophonePermission = ({ open, onAllow, onDeny }) => {
    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Microphone Access Required</DialogTitle>
            <DialogContent>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    py: 2 
                }}>
                    <MicIcon sx={{ fontSize: 60, color: '#4299e1', mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                        This app needs access to your microphone for the interview.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        We'll only record when you click the microphone button.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDeny} color="error">
                    Deny
                </Button>
                <Button 
                    onClick={onAllow} 
                    variant="contained" 
                    sx={{ 
                        bgcolor: '#4299e1',
                        '&:hover': { bgcolor: '#3182ce' }
                    }}
                >
                    Allow Microphone
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MicrophonePermission; 