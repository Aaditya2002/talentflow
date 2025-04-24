import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SettingsIcon from '@mui/icons-material/Settings';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { 
            text: 'Recruitment Dashboard', 
            icon: <DashboardIcon />, 
            path: '/',
            color: '#718096',
            description: 'Overview and analytics'
        },
        { 
            text: 'Job Requirements', 
            icon: <DescriptionIcon />, 
            path: '/job-input',
            color: '#718096',
            description: 'Create and manage job descriptions'
        },
        { 
            text: 'Resume Management', 
            icon: <CloudUploadIcon />, 
            path: '/resume-upload',
            color: '#718096',
            description: 'Upload and organize resumes'
        },
        { 
            text: 'Candidate Analysis', 
            icon: <AssessmentIcon />, 
            path: '/resume-analysis',
            color: '#4299e1',
            description: 'AI-powered resume analysis'
        },
        { 
            text: 'Talent Pool', 
            icon: <PeopleIcon />, 
            path: '/candidates',
            color: '#718096',
            description: 'View all candidates'
        },
        { 
            text: 'Screening Results', 
            icon: <PersonSearchIcon />, 
            path: '/candidate-screening',
            color: '#718096',
            description: 'Review matched candidates'
        }
    ];

    return (
        <Box sx={{
            width: '240px',
            height: '100vh',
            backgroundColor: '#fff',
            borderRight: '1px solid #edf2f7',
            padding: '24px 0',
        }}>
            <Typography
                variant="h6"
                sx={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#1a202c',
                    padding: '0 24px',
                    marginBottom: '32px'
                }}
            >
                UCI TalentFlow
            </Typography>

            <List sx={{ padding: 0 }}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        button
                        onClick={() => navigate(item.path)}
                        sx={{
                            padding: '12px 24px',
                            backgroundColor: location.pathname === item.path ? '#ebf8ff' : 'transparent',
                            borderLeft: location.pathname === item.path ? '3px solid #4299e1' : '3px solid transparent',
                            '&:hover': {
                                backgroundColor: location.pathname === item.path ? '#ebf8ff' : '#f7fafc'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ 
                            minWidth: '40px',
                            color: location.pathname === item.path ? '#4299e1' : item.color
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.text}
                            secondary={item.description}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    fontSize: '14px',
                                    fontWeight: location.pathname === item.path ? 600 : 500,
                                    color: location.pathname === item.path ? '#4299e1' : '#718096'
                                },
                                '& .MuiListItemText-secondary': {
                                    fontSize: '12px',
                                    color: '#a0aec0'
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ position: 'absolute', bottom: '24px', width: '240px' }}>
                <ListItem 
                    button 
                    onClick={() => navigate('/settings')}
                    sx={{ padding: '12px 24px' }}
                >
                    <ListItemIcon sx={{ minWidth: '40px', color: '#718096' }}>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Settings" 
                        secondary="Configure preferences"
                        sx={{
                            '& .MuiListItemText-primary': {
                                fontSize: '14px',
                                color: '#718096',
                                fontWeight: 500
                            },
                            '& .MuiListItemText-secondary': {
                                fontSize: '12px',
                                color: '#a0aec0'
                            }
                        }}
                    />
                </ListItem>
            </Box>
        </Box>
    );
}

export default Sidebar; 