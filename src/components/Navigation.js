import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    Container
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Description as DescriptionIcon,
    Upload as UploadIcon,
    Analytics as AnalyticsIcon,
    Group as GroupIcon,
    Psychology as PsychologyIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide navigation on login page
    if (location.pathname === '/login') {
        return null;
    }

    const navItems = [
        {
            label: 'Job Description',
            path: '/',
            icon: <DescriptionIcon />
        },
        {
            label: 'Upload Resumes',
            path: '/upload',
            icon: <UploadIcon />
        },
        {
            label: 'Analysis',
            path: '/analysis',
            icon: <AnalyticsIcon />
        },
        {
            label: 'Screening',
            path: '/screening',
            icon: <GroupIcon />
        },
        // {
        //     label: 'AI Interview',
        //     path: '/interview',
        //     icon: <PsychologyIcon />
        // },
        {
            label: 'Timeline',
            path: '/recruiter-timeline',
            icon: <CalendarIcon />
        }
    ];

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                mb: 3
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#2d3748',
                            fontWeight: 700,
                            display: { xs: 'none', md: 'block' }
                        }}
                    >
                        AI Recruitment Assistant
                    </Typography>

                    <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 1, md: 2 },
                        width: { xs: '100%', md: 'auto' },
                        justifyContent: { xs: 'space-between', md: 'flex-end' }
                    }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                startIcon={item.icon}
                                sx={{
                                    color: location.pathname === item.path ? '#4299e1' : '#718096',
                                    borderRadius: 2,
                                    px: { xs: 1, md: 2 },
                                    py: 1,
                                    '&:hover': {
                                        bgcolor: alpha('#4299e1', 0.1)
                                    },
                                    ...(location.pathname === item.path && {
                                        bgcolor: alpha('#4299e1', 0.1),
                                        fontWeight: 600
                                    })
                                }}
                            >
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    {item.label}
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navigation; 