import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Collapse } from '@mui/material';
import { Resizable } from 'react-resizable';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import 'react-resizable/css/styles.css';

function FilterSidebar() {
    const [width, setWidth] = useState(280);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Collapse/Expand Button */}
            <IconButton
                onClick={toggleSidebar}
                sx={{
                    position: 'absolute',
                    right: isExpanded ? -20 : -40,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    '&:hover': {
                        backgroundColor: '#f8fafc'
                    },
                    zIndex: 2
                }}
            >
                {isExpanded ? <ChevronLeftIcon /> : <FilterListIcon />}
            </IconButton>

            {/* Collapsible Sidebar */}
            <Collapse in={isExpanded} orientation="horizontal">
                <Resizable
                    width={width}
                    height={window.innerHeight}
                    onResize={(e, { size }) => {
                        setWidth(size.width);
                    }}
                    handle={
                        <div
                            className="custom-handle"
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                cursor: 'col-resize',
                                background: 'transparent',
                                zIndex: 10
                            }}
                        />
                    }
                    axis="x"
                    minConstraints={[200, 100]}
                    maxConstraints={[500, 100]}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: `${width}px`,
                            height: '100vh',
                            backgroundColor: '#fff',
                            borderRight: '1px solid #edf2f7',
                        }}
                    >
                        <Box sx={{ padding: '24px' }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '24px'
                            }}>
                                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                                    Filters
                                </Typography>
                                <Box>
                                    <IconButton size="small"><AddIcon /></IconButton>
                                    <IconButton size="small"><HistoryIcon /></IconButton>
                                    <IconButton size="small"><SwapHorizIcon /></IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ marginBottom: '24px' }}>
                                <Typography variant="subtitle2" sx={{ marginBottom: '8px' }}>
                                    AI Search
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Data Engineers with 4+ years..."
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ marginBottom: '24px' }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <Typography variant="subtitle2">Hard Skills</Typography>
                                    <IconButton size="small"><KeyboardArrowUpIcon /></IconButton>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {['Github', 'AWS', 'Rust', 'Flutter', 'SQL', 'Hadoop', 'GenAI', 'RedShift'].map((skill) => (
                                        <Box
                                            key={skill}
                                            sx={{
                                                padding: '4px 12px',
                                                backgroundColor: '#f7fafc',
                                                borderRadius: '16px',
                                                fontSize: '14px',
                                                color: '#4a5568',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    backgroundColor: '#edf2f7',
                                                    borderColor: '#cbd5e0'
                                                }
                                            }}
                                        >
                                            {skill}
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Resizable>
            </Collapse>
        </Box>
    );
}

export default FilterSidebar; 