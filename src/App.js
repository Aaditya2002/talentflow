import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResumeUpload from './components/ResumeUpload';
import ResumeAnalysis from './components/ResumeAnalysis';
import { JobProvider } from './context/JobContext';
import JobScreeningResults from './components/JobScreeningResults';
import Navigation from './components/Navigation';
import AIInterviewScreen from './components/AIInterviewScreen';
import TempLoginPage from './components/TempLoginPage';
import RecruiterTimeline from './components/RecruiterTimeline';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <JobProvider>
                    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
                        <Navigation />
                        <Container maxWidth="xl">
                            <Routes>
                                <Route path="/" element={<Navigate to="/job-description" replace />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/job-description" element={
                                    <ProtectedRoute>
                                        <JobDescriptionInput />
                                    </ProtectedRoute>
                                } />
                                <Route path="/upload" element={
                                    <ProtectedRoute>
                                        <ResumeUpload />
                                    </ProtectedRoute>
                                } />
                                <Route path="/analysis" element={
                                    <ProtectedRoute>
                                        <ResumeAnalysis />
                                    </ProtectedRoute>
                                } />
                                <Route path="/screening" element={
                                    <ProtectedRoute>
                                        <JobScreeningResults />
                                    </ProtectedRoute>
                                } />
                                {/* Removed ProtectedRoute from /interview */}
                                <Route path="/interview" element={<AIInterviewScreen />} />
                                <Route path="/temp-login" element={<TempLoginPage />} />
                                <Route path="/recruiter-timeline" element={
                                    <ProtectedRoute>
                                        <RecruiterTimeline />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </Container>
                    </Box>
                </JobProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
