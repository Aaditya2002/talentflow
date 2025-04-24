import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    Avatar,
    IconButton,
    Collapse,
    Rating,
    Stack,
    Button,
    Slider
} from '@mui/material';
import {
    Work as WorkIcon,
    LocationOn as LocationIcon,
    BusinessCenter as BusinessIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Star as StarIcon,
    VideoCall as VideoCallIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useJob } from '../context/JobContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function JobScreeningResults() {
    const [selectedJob, setSelectedJob] = useState(null);
    const [expandedCandidate, setExpandedCandidate] = useState(null);
    const { jobDescription } = useJob();
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [topCandidateCount, setTopCandidateCount] = useState(1);
    const [topCandidates, setTopCandidates] = useState([]);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState('day');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch("https://talentflow-backend.onrender.com/api/screen-results", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to fetch results: ${errorText}`);
            }

            const data = await response.json();
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
            setError(error.message);
            setJobs([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleJobClick = (job) => {
        setSelectedJob(job === selectedJob ? null : job);
        setExpandedCandidate(null);
    };

    const handleCandidateExpand = (candidateId) => {
        setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
    };

    const handleStartInterview = (candidate) => {
        const jobTitle = selectedJob?.title?.trim() || '';
        const candidateName = candidate?.name?.trim() || '';
        
        console.log('Starting interview with:', { jobTitle, candidateName });
        
        if (!jobTitle || !candidateName) {
            console.error('Missing required data:', { jobTitle, candidateName });
            return;
        }
        
        navigate('/interview', { 
            state: { 
                jobTitle,
                candidateName
            } 
        });
    };

    const handleSelectTopCandidates = () => {
        if (selectedJob) {
            const sortedCandidates = selectedJob.candidates
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, topCandidateCount);
            setTopCandidates(sortedCandidates);
            console.log("Top Candidates for Email:", sortedCandidates);
        }
    };

    const generateRandomCredentials = (name) => {
        const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
        const email = `${name.toLowerCase().replace(/\s+/g, '')}.${randomString}@example.com`; // Create a random email
        const password = randomString; // Use the random string as the password
        return { email, password };
    };

    const notifyAllCandidates = async () => {
        try {
            // Generate credentials for each candidate
            const candidatesWithCredentials = topCandidates.map(candidate => {
                const { email, password } = generateRandomCredentials(candidate.name);
                return {
                    name: candidate.name,
                    email: email,
                    password: password,
                    matchScore: candidate.matchScore,
                    strengths: candidate.strengths,
                    areas_of_improvement: candidate.areas_of_improvement,
                    matched_tools: candidate.matched_tools,
                    missing_tools: candidate.missing_tools,
                    skills: candidate.skills
                };
            });

            // Extract requirements from job description
            const requirements = selectedJob.description
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
                .map(line => line.replace(/^[-•]\s*/, '').trim());

            const jobDetails = {
                title: selectedJob.title || 'Software Engineer',
                company: selectedJob.company || 'Tech Company',
                location: selectedJob.location || 'Remote',
                type: selectedJob.type || 'Full-time',
                description: selectedJob.description || '',
                requirements: requirements.length > 0 ? requirements : [
                    'Bachelor\'s degree in Computer Science or related field',
                    '2+ years of software development experience',
                    'Strong programming skills',
                    'Experience with modern web technologies'
                ]
            };

            console.log('Sending notification request with payload:', {
                jobDetails,
                candidates: candidatesWithCredentials
            });

            const response = await fetch('https://talentflow-backend.onrender.com/api/allcandidatesEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({
                    jobDetails,
                    candidates: candidatesWithCredentials
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to notify candidates: ${errorText}`);
            }

            const data = await response.json();
            console.log('Notification sent successfully:', data);
            alert('All candidates have been notified successfully!');
        } catch (error) {
            console.error('Error notifying candidates:', error);
            alert(`Failed to notify candidates: ${error.message}`);
        }
    };

    const notifySelectedCandidate = async (candidate) => {
        try {
            // Generate credentials for the candidate
            const { email, password } = generateRandomCredentials(candidate.name);
            const candidateWithCredentials = {
                name: candidate.name,
                email: email,
                password: password,
                matchScore: candidate.matchScore,
                strengths: candidate.strengths,
                areas_of_improvement: candidate.areas_of_improvement,
                matched_tools: candidate.matched_tools,
                missing_tools: candidate.missing_tools,
                skills: candidate.skills
            };

            // Extract requirements from job description
            const requirements = selectedJob.description
                .split('\n')
                .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
                .map(line => line.replace(/^[-•]\s*/, '').trim());

            const jobDetails = {
                title: selectedJob.title || 'Software Engineer',
                company: selectedJob.company || 'Tech Company',
                location: selectedJob.location || 'Remote',
                type: selectedJob.type || 'Full-time',
                description: selectedJob.description || '',
                requirements: requirements.length > 0 ? requirements : [
                    'Bachelor\'s degree in Computer Science or related field',
                    '2+ years of software development experience',
                    'Strong programming skills',
                    'Experience with modern web technologies'
                ]
            };

            console.log('Sending notification request with payload:', {
                jobDetails,
                candidate: candidateWithCredentials
            });

            const response = await fetch('https://talentflow-backend.onrender.com/api/candidateEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({
                    jobDetails,
                    candidate: candidateWithCredentials
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`Failed to notify candidate: ${errorText}`);
            }

            const data = await response.json();
            console.log('Notification sent successfully:', data);
            alert('Candidate has been notified successfully!');
        } catch (error) {
            console.error('Error notifying candidate:', error);
            alert(`Failed to notify candidate: ${error.message}`);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let url = '';
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Months are 0-indexed
            const date = format(currentDate, 'yyyy-MM-dd'); // Ensure date is in 'YYYY-MM-DD' format
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's timezone

            if (selectedView === 'day') {
                url = `http://localhost:8000/api/calendar/events/day?date=${date}&timezone=${timezone}`;
            } else if (selectedView === 'month') {
                url = `http://localhost:8000/api/calendar/events/month?year=${year}&month=${month}&timezone=${timezone}`;
            } else if (selectedView === 'year') {
                url = `http://localhost:8000/api/calendar/events/year?year=${year}&timezone=${timezone}`;
            }

            const response = await fetch(url, {
                method: 'GET', // Specify the method
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Set content type
                }
            });

            // Check if the response is OK
            if (!response.ok) {
                const errorText = await response.text(); // Get the response text
                throw new Error(`Failed to fetch events: ${errorText}`);
            }

            const data = await response.json();
            // Ensure data is an array before setting state
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching events:', err);
            setEvents([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a365d', textAlign: 'center' }}>
                Job Screening Results
            </Typography>

            {/* <Typography variant="h6" sx={{ mb: 2 }}>
                Job Description
            </Typography>
            <Typography variant="body1">
                {jobDescription || "No job description provided."}
            </Typography>

            <Divider sx={{ my: 3 }} /> */}
{/* 
            <Typography variant="h6" sx={{ mb: 2 }}>
                Candidates Analysis
            </Typography>
            <List>
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <ListItem key={index} sx={{ mb: 2, p: 2, bgcolor: '#f7fafc', borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: '#4299e1', mr: 2 }}>
                                {job.candidates.length > 0 ? job.candidates[0].name.charAt(0) : "N"}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {job.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Company: {job.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Location: {job.location}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Type: {job.type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Description: {job.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Requirements: {job.requirements.length > 0 ? job.requirements.join(', ') : "None"}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No jobs available.
                    </Typography>
                )}
            </List> */}

            <Grid container spacing={4}>
                {/* Job Listings */}
                <Grid item xs={12} lg={selectedJob ? 4 : 12}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 600, 
                            color: '#2d3748',
                            mb: 1 
                        }}>
                            Active Job Listings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Click on a job to view candidate details
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                        {Array.isArray(jobs) && jobs.length > 0 ? (
                            jobs.map((job) => (
                                <Grid item xs={12} key={job.id}>
                                    <Card
                                        elevation={0}
                                        onClick={() => handleJobClick(job)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: job === selectedJob ? '#4299e1' : 'rgba(0, 0, 0, 0.08)',
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            backgroundColor: job === selectedJob ? '#e0f7fa' : '#ffffff',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                borderColor: '#4299e1',
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="h6" sx={{ 
                                                        fontWeight: 600,
                                                        color: job === selectedJob ? '#4299e1' : '#2d3748'
                                                    }}>
                                                        {job.title}
                                                    </Typography>
                                                    <Chip
                                                        label={`${job.candidates.length} Candidates`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha('#4299e1', 0.1),
                                                            color: '#4299e1',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </Box>
                                                
                                                <Stack direction="row" spacing={3}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <BusinessIcon sx={{ color: '#718096', fontSize: 20 }} />
                                                        <Typography sx={{ color: '#718096', fontSize: '0.9rem' }}>
                                                            {job.company}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LocationIcon sx={{ color: '#718096', fontSize: 20 }} />
                                                        <Typography sx={{ color: '#718096', fontSize: '0.9rem' }}>
                                                            {job.location}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                No jobs available.
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                {/* Candidates List */}
                {selectedJob && (
                    <Grid item xs={12} lg={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                                borderRadius: 2,
                                backgroundColor: '#ffffff'
                            }}
                        >
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 600, 
                                    color: '#2d3748',
                                    mb: 1 
                                }}>
                                    Candidates for {selectedJob.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedJob.candidates.length} candidates matched for this position
                                </Typography>
                            </Box>

                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Select number of top candidates to view:
                            </Typography>
                            <Slider
                                value={topCandidateCount}
                                min={1}
                                max={selectedJob.candidates.length}
                                step={1}
                                onChange={(event, newValue) => setTopCandidateCount(newValue)}
                                valueLabelDisplay="auto"
                                sx={{
                                    color: '#4299e1',
                                    height: 8,
                                    '& .MuiSlider-thumb': {
                                        height: 24,
                                        width: 24,
                                        backgroundColor: '#fff',
                                        border: '2px solid currentColor',
                                        '&:hover': {
                                            boxShadow: 'inherit',
                                        },
                                    },
                                    '& .MuiSlider-track': {
                                        height: 8,
                                        borderRadius: 4,
                                    },
                                    '& .MuiSlider-rail': {
                                        height: 8,
                                        borderRadius: 4,
                                    },
                                }}
                            />
                            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                                {topCandidateCount} Candidates
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={handleSelectTopCandidates}
                                sx={{ mb: 2 }}
                            >
                                Select Top Candidates
                            </Button>
                            <Button
                                variant="contained"
                                onClick={notifyAllCandidates}
                                disabled={topCandidates.length === 0}
                                sx={{ mb: 2, ml: 2 }}
                            >
                                Notify All Candidates
                            </Button>
                            <List sx={{ mt: 2 }}>
                                {topCandidates.map((candidate, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            display: 'block',
                                            mb: 2,
                                            p: 2,
                                            bgcolor: '#ffffff',
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'rgba(0, 0, 0, 0.08)',
                                            '&:hover': {
                                                borderColor: '#4299e1',
                                                bgcolor: alpha('#4299e1', 0.02)
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: '#4299e1',
                                                        width: 50,
                                                        height: 50,
                                                        fontSize: '1.2rem'
                                                    }}
                                                >
                                                    {candidate.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {candidate.name}
                                                    </Typography>
                                                    <Rating
                                                        value={candidate.matchScore / 20}
                                                        readOnly
                                                        precision={0.5}
                                                        size="small"
                                                        icon={<StarIcon sx={{ color: '#4299e1' }} />}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Chip
                                                    label={`${candidate.matchScore}% Match`}
                                                    sx={{
                                                        bgcolor: candidate.matchScore >= 80 ? '#9ae6b4' : '#fbd38d',
                                                        color: candidate.matchScore >= 80 ? '#22543d' : '#744210',
                                                        fontWeight: 600
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    startIcon={<VideoCallIcon />}
                                                    onClick={() => handleStartInterview(candidate)}
                                                    disabled={!selectedJob || !candidate.name}
                                                    sx={{
                                                        bgcolor: '#4299e1',
                                                        '&:hover': {
                                                            bgcolor: '#3182ce'
                                                        },
                                                        textTransform: 'none',
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    Notify Candidate
                                                </Button>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCandidateExpand(index)}
                                                    sx={{ 
                                                        bgcolor: alpha('#4299e1', 0.1),
                                                        '&:hover': { bgcolor: alpha('#4299e1', 0.2) }
                                                    }}
                                                >
                                                    {expandedCandidate === index ? 
                                                        <ExpandLessIcon sx={{ color: '#4299e1' }} /> : 
                                                        <ExpandMoreIcon sx={{ color: '#4299e1' }} />
                                                    }
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Collapse in={expandedCandidate === index}>
                                            <Box sx={{ mt: 3 }}>
                                                <Divider sx={{ mb: 3 }} />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={6}>
                                                        <Box sx={{ 
                                                            p: 2, 
                                                            bgcolor: alpha('#48bb78', 0.05),
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: alpha('#48bb78', 0.1)
                                                        }}>
                                                            <Typography 
                                                                variant="subtitle2" 
                                                                sx={{ 
                                                                    color: '#2f855a',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mb: 2
                                                                }}
                                                            >
                                                                <CheckCircleIcon fontSize="small" />
                                                                Strengths
                                                            </Typography>
                                                            <Stack spacing={1}>
                                                                {candidate.strengths.map((strength, idx) => (
                                                                    <Typography 
                                                                        key={idx} 
                                                                        variant="body2"
                                                                        sx={{ color: '#2f855a' }}
                                                                    >
                                                                        • {strength}
                                                                    </Typography>
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Box sx={{ 
                                                            p: 2, 
                                                            bgcolor: alpha('#f56565', 0.05),
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: alpha('#f56565', 0.1)
                                                        }}>
                                                            <Typography 
                                                                variant="subtitle2" 
                                                                sx={{ 
                                                                    color: '#c53030',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mb: 2
                                                                }}
                                                            >
                                                                <CancelIcon fontSize="small" />
                                                                Areas for Improvement
                                                            </Typography>
                                                            <Stack spacing={1}>
                                                                {candidate.areas_of_improvement.map((area, idx) => (
                                                                    <Typography 
                                                                        key={idx} 
                                                                        variant="body2"
                                                                        sx={{ color: '#c53030' }}
                                                                    >
                                                                        • {area}
                                                                    </Typography>
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#2d3748' }}>
                                                        Matched Tools
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {candidate.matched_tools.map((tool) => (
                                                            <Chip
                                                                key={tool}
                                                                label={tool}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha('#4299e1', 0.1),
                                                                    color: '#4299e1',
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#2d3748' }}>
                                                        Missing Tools
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {candidate.missing_tools.map((tool) => (
                                                            <Chip
                                                                key={tool}
                                                                label={tool}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha('#f56565', 0.1),
                                                                    color: '#f56565',
                                                                    fontWeight: 500
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Collapse>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Display Top Candidates */}
        </Box>
    );
}

export default JobScreeningResults;
