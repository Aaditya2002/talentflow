import React, { createContext, useState, useContext } from 'react';

const JobContext = createContext();

export function JobProvider({ children }) {
    const [jobDescription, setJobDescription] = useState('');
    const [jobAnalysis, setJobAnalysis] = useState(null);
    const [resumeResults, setResumeResults] = useState(null);
    const [candidateData, setCandidateData] = useState(null);
    const updateJobDescription = (description) => {
        setJobDescription(description);
    };

    const updateJobAnalysis = (analysis) => {
        setJobAnalysis(analysis);
    };

    const updateResumeResults = (results) => {
        setResumeResults(results);
    };

    const updateCandidateData = (data) => {
        setCandidateData(data);
    };

    return (
        <JobContext.Provider value={{ 
            jobDescription, 
            updateJobDescription, 
            jobAnalysis, 
            updateJobAnalysis, 
            resumeResults, 
            updateResumeResults,
            candidateData,
            updateCandidateData
        }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJob() {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJob must be used within a JobProvider');
    }
    return context;
} 