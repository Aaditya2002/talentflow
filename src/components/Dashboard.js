import React from 'react';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function StatCard({ title, value, icon, color }) {
    return (
        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
                backgroundColor: `${color}15`, 
                p: 1, 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography color="textSecondary" variant="body2">
                    {title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
}

function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Recruitment Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Stats Section */}
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Total Candidates"
                        value="1,254"
                        icon={<PeopleAltIcon sx={{ color: '#4299e1' }} />}
                        color="#4299e1"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Active Jobs"
                        value="23"
                        icon={<WorkIcon sx={{ color: '#48bb78' }} />}
                        color="#48bb78"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Interviews Scheduled"
                        value="45"
                        icon={<AssessmentIcon sx={{ color: '#ed8936' }} />}
                        color="#ed8936"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard 
                        title="Hiring Rate"
                        value="68%"
                        icon={<TrendingUpIcon sx={{ color: '#667eea' }} />}
                        color="#667eea"
                    />
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Recent Activity
                        </Typography>
                        {[
                            { title: 'New Resume Uploaded', progress: 'Processing...', value: 30 },
                            { title: 'Job Analysis Complete', progress: 'Ready for review', value: 100 },
                            { title: 'Candidate Screening', progress: 'In progress', value: 70 },
                        ].map((activity, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{activity.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {activity.progress}
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={activity.value}
                                    sx={{ height: 6, borderRadius: 1 }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Quick Actions
                        </Typography>
                        {[
                            'Upload New Resumes',
                            'Create Job Description',
                            'Review Candidates',
                            'Schedule Interviews'
                        ].map((action, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    backgroundColor: '#f7fafc',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#edf2f7'
                                    }
                                }}
                            >
                                <Typography variant="body2">
                                    {action}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
