import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Avatar, Typography, IconButton, TextField, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const candidates = [
    {
        name: 'John Smith',
        avatar: 'JS',
        location: 'Los Angeles, CA',
        company: { name: 'Chase', logo: '🏢' },
        position: 'Lead Data Analysis Engineer',
        experience: '10 yrs.',
        readiness: '5/5',
        score: 984
    },
    // Add more candidates...
];

function CandidateList() {
    const [loading, setLoading] = useState(false);

    return (
        <Box sx={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <Box sx={{
                padding: '16px 24px',
                borderBottom: '1px solid #edf2f7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                    Candidates <span style={{ color: '#a0aec0', marginLeft: '8px' }}>1,254</span>
                </Typography>
                <TextField
                    placeholder="Search"
                    size="small"
                    sx={{ width: '240px' }}
                />
            </Box>

            {loading ? (
                <Box sx={{ padding: '40px', textAlign: 'center' }}>
                    <CircularProgress size={40} />
                </Box>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Current Job</TableCell>
                                <TableCell>Exp.</TableCell>
                                <TableCell>Ready</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.map((candidate, index) => (
                                <TableRow 
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f7fafc',
                                            cursor: 'pointer'
                                        },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Avatar sx={{ width: 32, height: 32 }}>{candidate.avatar}</Avatar>
                                            <Typography>{candidate.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{candidate.location}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Typography sx={{ fontSize: '20px' }}>{candidate.company.logo}</Typography>
                                            <Typography>{`${candidate.company.name} · ${candidate.position}`}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{candidate.experience}</TableCell>
                                    <TableCell>{candidate.readiness}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            backgroundColor: '#ebf8ff',
                                            color: '#4299e1',
                                            borderRadius: '16px',
                                            padding: '4px 12px',
                                            display: 'inline-block',
                                            fontWeight: 500
                                        }}>
                                            {candidate.score}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small">
                                            <MoreVertIcon sx={{ color: '#a0aec0' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default CandidateList; 