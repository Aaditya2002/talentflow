import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { mockResumes } from '../data/mockData';
import CandidateDetails from './CandidateDetails';

// Transform mock data for candidate screening
const mockCandidates = mockResumes.map(resume => ({
    id: resume.id,
    name: resume.name,
    role: resume.experience[0].title,
    company: resume.experience[0].company,
    matchScore: resume.matchScore,
    skills: resume.skills.slice(0, 3).map(s => s.name),
    status: Math.random() > 0.3 ? 'Qualified' : 'Not Qualified'
}));

function CandidateScreening() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredCandidates(
            mockCandidates.filter(candidate => 
                candidate.name.toLowerCase().includes(term) ||
                candidate.role.toLowerCase().includes(term) ||
                candidate.company.toLowerCase().includes(term)
            )
        );
    };

    const handleViewDetails = (candidateId) => {
        const fullCandidate = mockResumes.find(resume => resume.id === candidateId);
        setSelectedCandidate(fullCandidate);
        setDetailsOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Candidate Screening Results
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <TextField
                                placeholder="Search candidates..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={handleSearch}
                                sx={{ width: 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#718096' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Box>
                                <Button
                                    startIcon={<FilterListIcon />}
                                    sx={{ mr: 1 }}
                                >
                                    Filter
                                </Button>
                                <Button
                                    startIcon={<SortIcon />}
                                >
                                    Sort
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Candidate</TableCell>
                                        <TableCell>Current Role</TableCell>
                                        <TableCell>Key Skills</TableCell>
                                        <TableCell align="center">Match Score</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCandidates.map((candidate) => (
                                        <TableRow 
                                            key={candidate.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#f7fafc',
                                                    cursor: 'pointer'
                                                }
                                            }}
                                            onClick={() => handleViewDetails(candidate.id)}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            bgcolor: '#4299e1',
                                                            width: 40,
                                                            height: 40,
                                                            mr: 2
                                                        }}
                                                    >
                                                        {candidate.name.split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {candidate.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {candidate.company}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{candidate.role}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {candidate.skills.map((skill) => (
                                                        <Chip
                                                            key={skill}
                                                            label={skill}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#ebf8ff',
                                                                color: '#4299e1'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`${candidate.matchScore}%`}
                                                    sx={{
                                                        bgcolor: candidate.matchScore >= 85 ? '#9ae6b4' : '#fbd38d',
                                                        color: candidate.matchScore >= 85 ? '#22543d' : '#744210'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    icon={candidate.status === 'Qualified' ? 
                                                        <CheckCircleIcon /> : 
                                                        <CancelIcon />
                                                    }
                                                    label={candidate.status}
                                                    sx={{
                                                        bgcolor: candidate.status === 'Qualified' ? '#e6fffa' : '#fff5f5',
                                                        color: candidate.status === 'Qualified' ? '#234e52' : '#822727',
                                                        '& .MuiChip-icon': {
                                                            color: candidate.status === 'Qualified' ? '#38b2ac' : '#f56565'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <VisibilityIcon sx={{ color: '#718096' }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Screening Summary
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Total Candidates
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#4299e1', fontWeight: 600 }}>
                                {mockCandidates.length}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Qualified Candidates
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#48bb78', fontWeight: 600 }}>
                                {mockCandidates.filter(c => c.status === 'Qualified').length}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Average Match Score
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#ed8936', fontWeight: 600 }}>
                                {Math.round(
                                    mockCandidates.reduce((acc, curr) => acc + curr.matchScore, 0) / 
                                    mockCandidates.length
                                )}%
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <CandidateDetails
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                candidate={selectedCandidate}
            />
        </Box>
    );
}

export default CandidateScreening;
