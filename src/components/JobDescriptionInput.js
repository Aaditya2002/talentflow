import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Chip,
    Divider,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { analyzeJobDescription } from '../services/api';
import { useJob } from '../context/JobContext';
import { useNavigate } from 'react-router-dom';

function JobDescriptionInput() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { updateJobAnalysis, updateJobDescription } = useJob();
    
    // State for job details
    const [jobTitle, setJobTitle] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const payload = {
            jobtitle: jobTitle,
            joblocation: jobLocation,
            jobtype: jobType,
            description: description
        };
        
        // Convert the payload object to a JSON string
        const jsonPayload = JSON.stringify(payload);
        console.log(jsonPayload);
        console.log(typeof(jsonPayload.jobtitle));
        console.log(typeof(jsonPayload.joblocation));
        console.log(typeof(jsonPayload.jobtype));
        console.log(typeof(jsonPayload.description));
        // Update the global context with the entire job details payload
        updateJobDescription(jsonPayload);

        try {
            const result = await analyzeJobDescription(jsonPayload);
            updateJobAnalysis(result);
            // Redirect to resume upload after job description is analyzed
            navigate('/upload');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f7fa' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'left' }}>
                Job Description Analysis
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Input Job Details
                        </Typography>

                        <TextField
                            fullWidth
                            label="Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0'
                                    }
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Job Location"
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0'
                                    }
                                }
                            }}
                        />

                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <InputLabel>Job Type</InputLabel>
                            <Select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                label="Job Type"
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0'
                                    }
                                }}
                            >
                                <MenuItem value="Hybrid">Hybrid</MenuItem>
                                <MenuItem value="Onsite">Onsite</MenuItem>
                                <MenuItem value="Remote">Remote</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter job description here..."
                            variant="outlined"
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0'
                                    }
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={!jobTitle || !jobLocation || !jobType || !description || loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                            sx={{ 
                                py: 1.5,
                                backgroundColor: '#4299e1',
                                '&:hover': {
                                    backgroundColor: '#3182ce'
                                }
                            }}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Job Description'}
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Analysis Results
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    Required Skills
                                </Typography>
                                <InfoOutlinedIcon 
                                    sx={{ 
                                        ml: 1, 
                                        color: '#718096',
                                        fontSize: 18
                                    }} 
                                />
                            </Box>
                            {/* Example skills display */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {/* Replace with actual extracted skills */}
                                <Chip label="Python" sx={{ backgroundColor: '#ebf8ff', color: '#4299e1' }} />
                                <Chip label="React" sx={{ backgroundColor: '#ebf8ff', color: '#4299e1' }} />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                                Job Summary
                            </Typography>
                            <Box sx={{ 
                                backgroundColor: '#f7fafc',
                                borderRadius: 1,
                                p: 2
                            }}>
                                <Typography variant="body2">
                                    The analysis will appear here after processing the job description.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default JobDescriptionInput;
