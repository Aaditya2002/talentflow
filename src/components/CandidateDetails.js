import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Chip,
    Avatar,
    Rating,
    Grid,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import StarIcon from '@mui/icons-material/Star';

function CandidateDetails({ open, onClose, candidate }) {
    if (!candidate) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Candidate Details</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                bgcolor: '#4299e1',
                                fontSize: '2rem',
                                mr: 2
                            }}
                        >
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5">{candidate.name}</Typography>
                            <Typography color="textSecondary">{candidate.experience[0].title}</Typography>
                            <Typography color="textSecondary">{candidate.email}</Typography>
                        </Box>
                        <Chip
                            label={`${candidate.matchScore}% Match`}
                            sx={{
                                bgcolor: candidate.matchScore >= 85 ? '#9ae6b4' : '#fbd38d',
                                color: candidate.matchScore >= 85 ? '#22543d' : '#744210',
                                fontSize: '1.1rem',
                                padding: '20px 15px'
                            }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Skills Assessment</Typography>
                            {candidate.skills.map((skill) => (
                                <Box 
                                    key={skill.name}
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        mb: 1 
                                    }}
                                >
                                    <Typography>{skill.name}</Typography>
                                    <Rating 
                                        value={skill.level} 
                                        readOnly 
                                        icon={<StarIcon sx={{ color: '#4299e1' }} />}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Languages</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {candidate.languages.map((language) => (
                                    <Chip
                                        key={language}
                                        icon={<LanguageIcon />}
                                        label={language}
                                        sx={{
                                            bgcolor: '#ebf8ff',
                                            color: '#4299e1'
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Professional Experience</Typography>
                            <List>
                                {candidate.experience.map((exp, index) => (
                                    <ListItem key={index} sx={{ display: 'block', mb: 2 }}>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <ListItemIcon>
                                                <WorkIcon sx={{ color: '#4299e1' }} />
                                            </ListItemIcon>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                    {exp.title}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    {exp.company} • {exp.duration}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ pl: 7 }}>
                                            {exp.highlights.map((highlight, i) => (
                                                <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                                                    • {highlight}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Education</Typography>
                            <List>
                                {candidate.education.map((edu, index) => (
                                    <ListItem key={index}>
                                        <ListItemIcon>
                                            <SchoolIcon sx={{ color: '#4299e1' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={edu.degree}
                                            secondary={`${edu.school} • ${edu.year}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CandidateDetails;
