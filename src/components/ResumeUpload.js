import React, { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    LinearProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { uploadResumes } from '../services/api';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { useJob } from '../context/JobContext';

function ResumeUpload() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState(null);
    const [fileErrors, setFileErrors] = useState({});
    const navigate = useNavigate();
    
    const { jobDescription, updateJobDescription, updateResumeResults } = useJob();

    const processFile = async (file) => {
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                try {
                    text = await extractTextFromPDF(file);
                } catch (pdfError) {
                    console.error('PDF processing error:', pdfError);
                    throw new Error(`Could not process PDF file: ${file.name}`);
                }
            } else if (file.type.includes('word')) {
                // For demonstration, you might want to add a Word document parser
                const reader = new FileReader();
                text = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsText(file);
                });
            } else {
                text = await file.text();
            }
            return text;
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error.message);
            setFileErrors(prev => ({
                ...prev,
                [file.id]: error.message
            }));
            throw error;
        }
    };

    console.log(jobDescription);

    const onDrop = useCallback(acceptedFiles => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substring(7),
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: true
    });

    const handleUpload = async () => {
        setUploading(true);
        setError(null);
    
        try {
            const extractionPromises = files.map(async (fileObj) => {
                const file = fileObj.file;
                let text = '';
    
                // Extract text based on file type
                if (file.type === 'application/pdf') {
                    text = await extractTextFromPDF(file);
                } else if (file.type.includes('word')) {
                    const reader = new FileReader();
                    text = await new Promise((resolve, reject) => {
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = (e) => reject(e);
                        reader.readAsText(file);
                    });
                } else {
                    text = await file.text();
                }
    
                // Safely parse jobDescription
                let jobDescriptionParsed;
                try {
                    if (typeof jobDescription === 'string') {
                        jobDescriptionParsed = jobDescription.trim() ? JSON.parse(jobDescription) : {};
                    } else {
                        jobDescriptionParsed = jobDescription || {};
                    }
                } catch (parseError) {
                    console.error('Error parsing job description:', parseError);
                    jobDescriptionParsed = {};
                }
    
                // Build payload
                const payload = {
                    resume_text: text,
                    job_description: jobDescriptionParsed
                };
    
                console.log('Sending payload:', payload); // Debug log
    
                // Send request
                const response = await fetch("https://recruiteraiagentbackend-1.onrender.com/api/extract-resume-info", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    credentials: "include",
                    mode: "cors",
                    body: JSON.stringify(payload)
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server response:', errorText);
                    throw new Error(`Server responded with status ${response.status}: ${errorText}`);
                }
    
                return await response.json();
            });
    
            // Wait for all resumes to be processed
            const results = await Promise.all(extractionPromises);
            console.log("All resume extraction results:", results);
    
            // Stringify before storing
            const jsonString = JSON.stringify(results);
            updateResumeResults(jsonString);
    
            // Navigate to ResumeAnalysis
            navigate('/analysis');
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message);
            alert(`An error occurred while processing resumes: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };
    
      

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Resume Upload
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragActive ? '#4299e1' : '#e2e8f0',
                                borderRadius: 2,
                                p: 6,
                                textAlign: 'center',
                                backgroundColor: isDragActive ? '#ebf8ff' : '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: '#4299e1',
                                    backgroundColor: '#ebf8ff'
                                }
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon sx={{ fontSize: 48, color: '#4299e1', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Drag & Drop Resumes Here
                            </Typography>
                            <Typography color="textSecondary">
                                or click to select files (PDF, DOC, DOCX)
                            </Typography>
                        </Box>

                        {files.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Selected Files ({files.length})
                                </Typography>
                                <List>
                                    {files.map((file) => (
                                        <ListItem
                                            key={file.id}
                                            sx={{
                                                border: '1px solid #e2e8f0',
                                                borderRadius: 1,
                                                mb: 1,
                                                backgroundColor: '#fff',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                                <InsertDriveFileIcon sx={{ mr: 2, color: '#4299e1' }} />
                                                <ListItemText 
                                                    primary={file.file.name}
                                                    secondary={`${(file.file.size / 1024 / 1024).toFixed(2)} MB`}
                                                />
                                                <ListItemSecondaryAction>
                                                    {file.status === 'success' && (
                                                        <CheckCircleIcon sx={{ color: '#48bb78' }} />
                                                    )}
                                                    {file.status === 'error' && (
                                                        <ErrorIcon sx={{ color: '#f56565' }} />
                                                    )}
                                                    {file.status === 'pending' && (
                                                        <IconButton 
                                                            edge="end" 
                                                            onClick={() => removeFile(file.id)}
                                                            disabled={uploading}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    )}
                                                </ListItemSecondaryAction>
                                            </Box>
                                            {fileErrors[file.id] && (
                                                <Typography 
                                                    color="error" 
                                                    variant="caption" 
                                                    sx={{ mt: 1, display: 'block' }}
                                                >
                                                    {fileErrors[file.id]}
                                                </Typography>
                                            )}
                                            {uploadProgress[file.id] !== undefined && (
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={uploadProgress[file.id]}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 2
                                                    }}
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleUpload}
                                    disabled={uploading || files.every(f => f.status !== 'pending')}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        backgroundColor: '#4299e1',
                                        '&:hover': {
                                            backgroundColor: '#3182ce'
                                        }
                                    }}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Selected Files'}
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Upload Guidelines
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                Accepted File Types
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                • PDF files (.pdf)<br />
                                • Word documents (.doc, .docx)
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                File Requirements
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                • Maximum file size: 10MB<br />
                                • Clear and legible text<br />
                                • No password protection<br />
                                • One resume per file
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                                Best Practices
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                • Use standard fonts<br />
                                • Avoid heavy graphics<br />
                                • Include contact information<br />
                                • Properly formatted sections
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ResumeUpload;
