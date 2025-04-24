import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container
} from '@mui/material';
import {
    Description as DescriptionIcon,
    Upload as UploadIcon,
    Analytics as AnalyticsIcon,
    Group as GroupIcon,
    Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

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
        {
            label: 'AI Interview',
            path: '/interview',
            icon: <PsychologyIcon />
        }
    ];

    return (
        <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 1 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                startIcon={item.icon}
                                sx={{
                                    color: location.pathname === item.path ? '#4299e1' : '#718096',
                                    bgcolor: location.pathname === item.path ? alpha('#4299e1', 0.1) : 'transparent',
                                    '&:hover': {
                                        bgcolor: location.pathname === item.path 
                                            ? alpha('#4299e1', 0.2) 
                                            : alpha('#718096', 0.1)
                                    },
                                    textTransform: 'none',
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar; 