import axios from 'axios';

const API_BASE_URL = 'https://talentflow-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true
});

export const analyzeJobDescription = async (payload) => {
    try {
        console.log(payload);
        // Send the entire payload object in the request body
        const response = await api.post('/job-description', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to server. Please make sure the backend server is running.');
        }
        throw error;
    }
};


export const uploadResumes = async (formData, endpoint = '/resume-upload') => {
    try {
        const response = await api.post(endpoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log('Upload progress:', percentCompleted);
            },
        });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to server. Please make sure the backend server is running.');
        }
        throw error;
    }
};

export default api; 