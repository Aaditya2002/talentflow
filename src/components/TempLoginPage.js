import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useJob } from '../context/JobContext';

const TempLoginPage = () => {
    const [tempEmail, setTempEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { updateCandidateData } = useJob(); // Use the correct function name

    const handleLogin = async () => {
        const payload = { temp_email: tempEmail, password };
        console.log('Payload being sent to API:', JSON.stringify(payload, null, 2));

        try {
            const response = await fetch('https://talentflow-backend.onrender.com/api/tempAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Candidate Data:', data);

            // Set candidate data in context
            updateCandidateData({ candidateName: data.candidate_name, jobTitle: data.job_title }); // Use the correct function

            // Redirect to AI Interview Screen
            navigate('/interview');
        } catch (error) {
            console.error('Error during login:', error);
            // Handle error (e.g., show a notification)
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                Candidate Login
            </Typography>
            <TextField
                label="Temporary Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
            />
            <TextField
                label="Temporary Password"
                variant="outlined"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" fullWidth onClick={handleLogin}>
                Login
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Use the temporary credentials sent to your email.
            </Typography>
        </Box>
    );
};

export default TempLoginPage; 