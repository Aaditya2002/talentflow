import React, { useState } from 'react';
import { useJob } from '../context/JobContext'; // Import the context
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Button,
    Card,
    CardContent,
    IconButton,
    Collapse,
    Stack,
    Rating,
    Tabs,
    Tab
} from '@mui/material';
import {
    Work as WorkIcon,
    School as SchoolIcon,
    Star as StarIcon,
    Code as CodeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CheckCircle as CheckCircleIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

function getStars(level) {
    return Array.from({ length: parseInt(level) }, (_, i) => (
        <StarIcon key={i} sx={{ color: '#4299e1', fontSize: '1.2rem' }} />
    ));
}

function ResumeAnalysis() {
    const { resumeResults } = useJob();
    const [selectedTab, setSelectedTab] = useState(0);
    const [expandedSections, setExpandedSections] = useState({});
    const navigate = useNavigate();

    if (!resumeResults) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>
                    No data available for analysis.
                </Typography>
            </Box>
        );
    }

    let parsedResults;
    try {
        parsedResults = JSON.parse(resumeResults);
        if (!Array.isArray(parsedResults)) {
            parsedResults = [parsedResults];
        }
    } catch (err) {
        console.error("Failed to parse JSON from resumeResults:", err);
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>
                    Invalid data format.
                </Typography>
            </Box>
        );
    }

    const handleExpandSection = (resumeIndex, section) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${resumeIndex}-${section}`]: !prev[`${resumeIndex}-${section}`]
        }));
    };

    const isExpanded = (resumeIndex, section) => {
        return expandedSections[`${resumeIndex}-${section}`];
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Typography variant="h4" sx={{ 
                mb: 4, 
                fontWeight: 700, 
                color: '#1a365d',
                textAlign: 'center'
            }}>
                Resume Analysis Results
            </Typography>

            {/* Tabs for multiple resumes */}
            {parsedResults.length > 1 && (
                <Box sx={{ 
                    width: '100%', 
                    mb: 4,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    <Tabs 
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 60,
                                minWidth: 200,
                                fontWeight: 600,
                                color: '#718096',
                                '&.Mui-selected': {
                                    color: '#4299e1',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#4299e1',
                                height: 3
                            }
                        }}
                    >
                        {parsedResults.map((resume, index) => (
                            <Tab 
                                key={index}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                width: 35, 
                                                height: 35,
                                                bgcolor: selectedTab === index ? '#4299e1' : '#A0AEC0',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {resume.personalinfo.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {resume.personalinfo.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#718096' }}>
                                                {`${resume.matchScore}% Match`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>
            )}

            {parsedResults.map((resume, index) => (
                <Box
                    key={index}
                    sx={{
                        display: selectedTab === index ? 'block' : 'none',
                        maxWidth: 1200,
                        margin: '0 auto'
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                            overflow: 'visible'
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                            {/* Profile Header */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 3,
                                mb: 4
                            }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: '#4299e1',
                                        fontSize: '1.5rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {resume.personalinfo.name.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                        {resume.personalinfo.name}
                                    </Typography>
                                    <Stack direction="row" spacing={3}>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            {resume.personalinfo.email}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            {resume.personalinfo.phone}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Chip
                                    label={`${resume.matchScore}% Match`}
                                    icon={<TimelineIcon />}
                                    sx={{
                                        height: 'auto',
                                        py: 2,
                                        px: 3,
                                        borderRadius: 2,
                                        bgcolor: resume.matchScore >= 80 ? '#9ae6b4' : '#fbd38d',
                                        color: resume.matchScore >= 80 ? '#22543d' : '#744210',
                                        '& .MuiChip-label': {
                                            fontSize: '1.1rem',
                                            fontWeight: 600
                                        }
                                    }}
                                />
                            </Box>

                            {/* Skills Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#2d3748',
                                        fontWeight: 600
                                    }}>
                                        <CodeIcon /> Skills Assessment
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleExpandSection(index, 'skills')}
                                        sx={{ 
                                            bgcolor: alpha('#4299e1', 0.1),
                                            '&:hover': { bgcolor: alpha('#4299e1', 0.2) }
                                        }}
                                    >
                                        {isExpanded(index, 'skills') ? 
                                            <ExpandLessIcon sx={{ color: '#4299e1' }} /> : 
                                            <ExpandMoreIcon sx={{ color: '#4299e1' }} />
                                        }
                                    </IconButton>
                                </Box>
                                <Collapse in={isExpanded(index, 'skills')}>
                                    <Grid container spacing={2}>
                                        {resume.skills.map((skill) => (
                                            <Grid item xs={12} sm={6} md={4} key={skill.name}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0, 0, 0, 0.08)',
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 500 }}>
                                                        {skill.name}
                                                    </Typography>
                                                    <Rating
                                                        value={skill.level}
                                                        readOnly
                                                        icon={<StarIcon sx={{ color: '#4299e1' }} />}
                                                    />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse>
                            </Box>

                            {/* Experience Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#2d3748',
                                        fontWeight: 600
                                    }}>
                                        <WorkIcon /> Professional Experience
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleExpandSection(index, 'experience')}
                                        sx={{ 
                                            bgcolor: alpha('#4299e1', 0.1),
                                            '&:hover': { bgcolor: alpha('#4299e1', 0.2) }
                                        }}
                                    >
                                        {isExpanded(index, 'experience') ? 
                                            <ExpandLessIcon sx={{ color: '#4299e1' }} /> : 
                                            <ExpandMoreIcon sx={{ color: '#4299e1' }} />
                                        }
                                    </IconButton>
                                </Box>
                                <Collapse in={isExpanded(index, 'experience')}>
                                    <List sx={{ pl: 0 }}>
                                        {resume.experience.map((exp, index) => (
                                            <ListItem 
                                                key={index} 
                                                sx={{ 
                                                    display: 'block', 
                                                    mb: 3,
                                                    p: 3,
                                                    backgroundColor: alpha('#f7fafc', 0.5),
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'rgba(0, 0, 0, 0.08)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                                        {exp.title}
                                                    </Typography>
                                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                                        {exp.duration}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                                                    {exp.company}
                                                </Typography>
                                                <Box sx={{ pl: 2 }}>
                                                    {exp.highlights.map((highlight, i) => (
                                                        <Typography 
                                                            key={i} 
                                                            variant="body2" 
                                                            sx={{ 
                                                                mb: 1,
                                                                color: 'text.secondary',
                                                                '&:before': {
                                                                    content: '"•"',
                                                                    marginRight: '8px',
                                                                    color: '#4299e1'
                                                                }
                                                            }}
                                                        >
                                                                {highlight}
                                                            </Typography>
                                                    ))}
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>

                            {/* Education Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#2d3748',
                                        fontWeight: 600
                                    }}>
                                        <SchoolIcon /> Education
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleExpandSection(index, 'education')}
                                        sx={{ 
                                            bgcolor: alpha('#4299e1', 0.1),
                                            '&:hover': { bgcolor: alpha('#4299e1', 0.2) }
                                        }}
                                    >
                                        {isExpanded(index, 'education') ? 
                                            <ExpandLessIcon sx={{ color: '#4299e1' }} /> : 
                                            <ExpandMoreIcon sx={{ color: '#4299e1' }} />
                                        }
                                    </IconButton>
                                </Box>
                                <Collapse in={isExpanded(index, 'education')}>
                                    <Grid container spacing={3}>
                                        {resume.education.map((edu, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 3,
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0, 0, 0, 0.08)',
                                                        borderRadius: 2,
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '1rem', md: '1.1rem' }
                                                        }}
                                                    >
                                                        {edu.degree}
                                                    </Typography>
                                                    <Typography 
                                                        color="text.secondary"
                                                        sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                                                    >
                                                        {edu.institution}
                                                    </Typography>
                                                    <Typography 
                                                        color="text.secondary" 
                                                        sx={{ fontSize: '0.9rem' }}
                                                    >
                                                        {edu.year}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse>
                            </Box>

                            {/* Projects Section */}
                            <Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#2d3748',
                                        fontWeight: 600
                                    }}>
                                        <CodeIcon /> Projects
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleExpandSection(index, 'projects')}
                                        sx={{ 
                                            bgcolor: alpha('#4299e1', 0.1),
                                            '&:hover': { bgcolor: alpha('#4299e1', 0.2) }
                                        }}
                                    >
                                        {isExpanded(index, 'projects') ? 
                                            <ExpandLessIcon sx={{ color: '#4299e1' }} /> : 
                                            <ExpandMoreIcon sx={{ color: '#4299e1' }} />
                                        }
                                    </IconButton>
                                </Box>
                                <Collapse in={isExpanded(index, 'projects')}>
                                    <Grid container spacing={3}>
                                        {resume.projects.map((project, index) => (
                                            <Grid item xs={12} md={6} key={index}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 3,
                                                        border: '1px solid',
                                                        borderColor: 'rgba(0, 0, 0, 0.08)',
                                                        borderRadius: 2,
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '1rem', md: '1.1rem' }
                                                        }}
                                                    >
                                                        {project.title}
                                                    </Typography>
                                                    <Typography 
                                                        color="text.secondary"
                                                        sx={{ 
                                                            fontSize: { xs: '0.9rem', md: '1rem' },
                                                            lineHeight: 1.6
                                                        }}
                                                    >
                                                        {project.description}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Collapse>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
}

export default ResumeAnalysis;
