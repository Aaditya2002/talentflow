import React from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

function Filters() {
    return (
        <Box sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fff' }}>
            <Typography variant="h6">Filters</Typography>
            <TextField fullWidth label="Search" variant="outlined" margin="normal" />
            <Typography variant="subtitle1">Job Title</Typography>
            <TextField fullWidth variant="outlined" margin="normal" />
            <Typography variant="subtitle1">Hard Skills</Typography>
            <FormControlLabel control={<Checkbox />} label="SQL" />
            <FormControlLabel control={<Checkbox />} label="AWS" />
            <FormControlLabel control={<Checkbox />} label="Python" />
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>Apply Filters</Button>
        </Box>
    );
}

export default Filters; 