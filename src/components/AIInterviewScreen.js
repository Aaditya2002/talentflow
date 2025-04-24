import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Button,
    Avatar,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Card,
    CardContent,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    RestartAlt as RestartIcon,
    Send as SendIcon,
    Psychology as PsychologyIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Timer as TimerIcon,
    SentimentSatisfiedAlt as SentimentIcon,
    LiveHelp as LiveHelpIcon,
    WavingHand as WaveIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceAnimation from './VoiceAnimation';
import AudioService from '../services/audioService';
import MicrophonePermission from './MicrophonePermission';
import { useLocation } from 'react-router-dom';
import { useJob } from '../context/JobContext';

function AIInterviewScreen() {
    const location = useLocation();
    const { jobTitle, candidateName } = location.state || {};

    const [isRecording, setIsRecording] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [showInstructions, setShowInstructions] = useState(true);
    const [transcribedText, setTranscribedText] = useState('');
    const [micPermission, setMicPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const [showPermissionDialog, setShowPermissionDialog] = useState(false);
    const [audioService] = useState(() => AudioService.getInstance());
    const [conversation, setConversation] = useState([]);
    const speechSynthesisRef = useRef(null);

    const totalQuestions = 5;
    const progress = (currentQuestion / totalQuestions) * 100;

    // Add state to track if we have valid interview data
    const [hasValidData, setHasValidData] = useState(false);

    const [isConversationActive, setIsConversationActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const silenceTimeoutRef = useRef(null);

    // Add a new state for processing
    const [isProcessing, setIsProcessing] = useState(false);

    // Add state for confirmation dialog
    const [showEndDialog, setShowEndDialog] = useState(false);

    const { candidateData } = useJob();
    const { candidateName: contextCandidateName, jobTitle: contextJobTitle } = candidateData || {};

    useEffect(() => {
        if (contextCandidateName && contextJobTitle) {
            setHasValidData(true);
            console.log('Interview Details:', { contextCandidateName, contextJobTitle });
        } else {
            console.error('Missing interview details:', { contextCandidateName, contextJobTitle });
            setHasValidData(false);
        }
    }, [contextCandidateName, contextJobTitle]);

    useEffect(() => {
        checkMicrophonePermission();
    }, []);

    const checkMicrophonePermission = async () => {
        try {
            const permission = await navigator.permissions.query({ name: 'microphone' });
            setMicPermission(permission.state);

            permission.onchange = () => {
                setMicPermission(permission.state);
            };
        } catch (error) {
            console.error('Error checking microphone permission:', error);
            setMicPermission('prompt');
        }
    };

    // Function to analyze interview response and get AI response
    const analyzeInterviewResponse = async (audioText) => {
        try {
            setIsProcessing(true);

            // Get job title and candidate name from either context or location state
            const jobTitle = contextJobTitle || jobTitle;
            const candidateName = contextCandidateName || candidateName;

            // Validate required data
            if (!jobTitle || !candidateName) {
                console.error('Missing interview data:', { jobTitle, candidateName });
                throw new Error('Missing required interview data. Please start the interview from the candidate screening page.');
            }

            // Prepare the request payload
            const payload = {
                job_title: jobTitle.trim(),
                candidate_name: candidateName.trim(),
                audio_text: audioText.trim()
            };

            console.log('Sending interview data:', payload);

            const response = await fetch('https://talentflow-backend.onrender.com/api/analyze-interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Response:', errorData);
                throw new Error(`API call failed with status ${response.status}: ${JSON.stringify(errorData.detail || 'Unknown error')}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Extract the correct response field
            return data.interview_analysis || data.response || "I'm processing your response. Please continue.";
        } catch (error) {
            console.error('Error analyzing interview:', error);
            return error.message || 'I apologize, but I encountered an error. Please try again.';
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to speak text using browser's speech synthesis
    const speakText = (text) => {
        return new Promise((resolve) => {
            // Cancel any ongoing speech
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure speech settings for Indian English
            utterance.rate = 0.9;  // Slightly slower rate
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            utterance.lang = 'en-IN';  // Set to Indian English

            // Handle speech events
            utterance.onstart = () => {
                console.log('Speech started');
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                console.log('Speech ended');
                setIsSpeaking(false);
                resolve();
                // Restart voice detection after AI speech ends
                audioService.startRecording(handleTranscriptionComplete); // Restart recording
            };

            utterance.onerror = (event) => {
                console.error('Speech error:', event);
                setIsSpeaking(false);
                
                // Retry on error
                if (event.error !== 'interrupted') {
                    console.log('Retrying speech...');
                    setTimeout(() => {
                        window.speechSynthesis.speak(utterance);
                    }, 100);
                } else {
                    resolve();
                }
            };

            // Wait for voices to be loaded
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
                
                // Try to find Microsoft Zira voice
                const preferredVoice = voices.find(voice => 
                    voice.name.toLowerCase().includes('microsoft zira')
                ) || voices.find(voice => 
                    voice.name.toLowerCase().includes('zira')
                ) || voices.find(voice => 
                    voice.name.toLowerCase().includes('female')
                ) || voices[0];

                if (preferredVoice) {
                    console.log('Selected voice:', preferredVoice.name);
                    utterance.voice = preferredVoice;
                } else {
                    console.warn('No suitable voice found, using default voice');
                }

                // Store reference and speak
                speechSynthesisRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            };

            if (window.speechSynthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                // Wait for voices to be loaded
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        });
    };

    // Add this useEffect to initialize voices early
    useEffect(() => {
        const initVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('Initializing voice:', voices.map(v => `${v.name} (${v.lang})`));
        };

        if (window.speechSynthesis) {
            if (window.speechSynthesis.getVoices().length > 0) {
                initVoices();
            } else {
                window.speechSynthesis.onvoiceschanged = initVoices;
            }
        }
    }, []);

    // Function to start continuous conversation
    const startContinuousConversation = () => {
        console.log('Starting continuous conversation');
        setIsConversationActive(true);
        setIsRecording(true);

        // Start recording immediately without AI introduction
        audioService.startRecording(handleTranscriptionComplete);
    };

    // Function to stop continuous conversation
    const stopContinuousConversation = () => {
        // Show confirmation dialog
        setShowEndDialog(true);

        // Pause recording while waiting for confirmation
        audioService.stopRecording();

        // Pause any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.pause();
        }
    };

    const handleConfirmEnd = () => {
        // Stop all ongoing processes
        setIsConversationActive(false);
        setIsRecording(false);
        setIsSpeaking(false);

        // Stop recording
        audioService.stopRecording();

        // Cancel any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            // Reset speech synthesis
            window.speechSynthesis.resume();
        }

        // Clear any pending timeouts
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }

        // Stop any ongoing audio tracks
        if (audioService.stream) {
            audioService.stream.getTracks().forEach(track => track.stop());
        }

        // Clear the speech synthesis reference
        if (speechSynthesisRef.current) {
            speechSynthesisRef.current = null;
        }

        // Close the dialog
        setShowEndDialog(false);

        console.log('Interview ended, all processes cleaned up');
    };

    // Function to handle transcription completion
    const handleTranscriptionComplete = async (text) => {
        console.log('handleTranscriptionComplete called with:', text);

        // Only process if there's meaningful text
        if (text && text.trim() && text !== 'Error transcribing audio') {
            try {
                setIsProcessing(true);

                // Get job title and candidate name from either context or location state
                const jobTitle = contextJobTitle || jobTitle;
                const candidateName = contextCandidateName || candidateName;

                // Validate required data
                if (!jobTitle || !candidateName) {
                    console.error('Missing interview data:', { jobTitle, candidateName });
                    throw new Error('Missing required interview data. Please start the interview from the candidate screening page.');
                }

                // Add user's response to conversation
                const userMessage = { role: 'user', content: text };
                setConversation(prev => [...prev, userMessage]);

                // Prepare the request payload
                const payload = {
                    job_title: jobTitle.trim(),
                    candidate_name: candidateName.trim(),
                    audio_text: text.trim()
                };

                console.log('Sending interview data:', payload);

                // Make the API call with JSON data
                const response = await fetch('https://talentflow-backend.onrender.com/api/analyze-interview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        // 'Access-Control-Allow-Origin': '*'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API Error Response:', errorData);
                    throw new Error(`API call failed with status ${response.status}: ${JSON.stringify(errorData.detail || 'Unknown error')}`);
                }

                const data = await response.json();
                console.log('API Response received:', data);

                if (data.interview_analysis) {
                    // Add AI's response to conversation
                    const aiMessage = { role: 'assistant', content: data.interview_analysis };
                    setConversation(prev => [...prev, aiMessage]);

                    // Speak AI's response
                    await speakText(data.interview_analysis);

                    // Resume recording
                    if (isConversationActive) {
                        audioService.startRecording(handleTranscriptionComplete);
                    }
                }
            } catch (error) {
                console.error('Error in API call:', error);
                const errorMessage = error.message || 'I apologize, but I encountered an error. Please try again.';
                const aiMessage = { role: 'assistant', content: errorMessage };
                setConversation(prev => [...prev, aiMessage]);
                await speakText(errorMessage);
            } finally {
                setIsProcessing(false);
            }
        } else {
            console.log('No meaningful text to process, restarting recording');
            audioService.startRecording(handleTranscriptionComplete);
        }
    };

    // Add a function to handle the start recording button
    const handleStartRecording = async () => {
        if (micPermission === 'denied') {
            alert('Microphone access is required for the interview. Please enable it in your browser settings.');
            return;
        }

        if (micPermission === 'prompt') {
            setShowPermissionDialog(true);
            return;
        }

        startContinuousConversation();
    };

    const handleMicrophoneAllow = async () => {
        setShowPermissionDialog(false);
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission('granted');
            handleStartRecording();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setMicPermission('denied');
        }
    };

    const handleMicrophoneDeny = () => {
        setShowPermissionDialog(false);
        setMicPermission('denied');
    };

    const handleStopRecording = () => {
        console.log('Stopping recording from UI...');
        audioService.stopRecording();
        setIsRecording(false);
    };

    // Update the RecordingOverlay component
    const RecordingOverlay = () => (
        <AnimatePresence>
            {isConversationActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    {/* Voice Animation */}
                    <VoiceAnimation />

                    {/* Status Text */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#fff',
                                mt: 8,
                                textAlign: 'center',
                                fontWeight: 600,
                                textShadow: '0 2px 10px rgba(66, 153, 225, 0.5)'
                            }}
                        >
                            {isSpeaking ? 'AI is speaking...' :
                                isProcessing ? 'AI is thinking...' :
                                    'Listening...'}
                        </Typography>
                    </motion.div>

                    {/* Close Button */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <IconButton
                            onClick={stopContinuousConversation}
                            sx={{
                                mt: 4,
                                bgcolor: '#f56565',
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: '#e53e3e'
                                },
                                width: 64,
                                height: 64,
                                boxShadow: '0 4px 20px rgba(245, 101, 101, 0.5)'
                            }}
                        >
                            <MicOffIcon />
                        </IconButton>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Function to render conversation history
    const ConversationHistory = () => (
        <Box sx={{ mt: 4, maxHeight: '400px', overflowY: 'auto' }}>
            {conversation.map((message, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            bgcolor: message.role === 'assistant' ? 'rgba(66, 153, 225, 0.1)' : '#e1f5fe',
                            border: '1px solid',
                            borderColor: message.role === 'assistant' ? '#4299e1' : '#b3e5fc',
                            maxWidth: '80%',
                            p: 2,
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: message.role === 'user' ? 'bold' : 'normal' }}>
                            {message.role === 'user' ? 'You' : 'AI Interviewer'}
                        </Typography>
                        <Typography>{message.content}</Typography>
                    </Card>
                </Box>
            ))}
        </Box>
    );

    // Update the TranscribedTextDisplay component
    const TranscribedTextDisplay = () => (
        <Box sx={{ mt: 4 }}>
            <ConversationHistory />
            {isRecording && (
                <Box sx={{ p: 3, bgcolor: 'rgba(66, 153, 225, 0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Recording your answer...
                    </Typography>
                </Box>
            )}
        </Box>
    );

    // Cleanup on unmount
    useEffect(() => {
        const currentSilenceTimeout = silenceTimeoutRef.current;
        return () => {
            stopContinuousConversation();
            if (currentSilenceTimeout) {
                clearTimeout(currentSilenceTimeout);
            }
        };
    }, []);

    // Add error state display
    if (!hasValidData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Missing Interview Data
                </Typography>
                <Typography>
                    Please start the interview from the candidate screening page.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: { xs: 2, md: 4 },
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Header Section */}
            <Box sx={{
                textAlign: 'center',
                mb: 6,
                position: 'relative'
            }}>
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#1a365d',
                    mb: 2
                }}>
                    AI Interview Session
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Your AI interviewer will guide you through the process
                </Typography>

                {/* Progress Indicator */}
                <Box sx={{
                    mt: 4,
                    maxWidth: 600,
                    mx: 'auto',
                    position: 'relative'
                }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: alpha('#4299e1', 0.1),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4299e1',
                                borderRadius: 5
                            }
                        }}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: -20,
                            color: '#718096'
                        }}
                    >
                        Question {currentQuestion} of {totalQuestions}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Main Interview Area */}
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'rgba(0, 0, 0, 0.08)',
                            height: '100%',
                            position: 'relative'
                        }}
                    >
                        {conversation.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                    mb: 2
                                }}
                            >
                                {/* AI Avatar (Left) */}
                                {msg.role === 'ai' && (
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: '#4299e1',
                                            boxShadow: '0 4px 14px rgba(66, 153, 225, 0.3)'
                                        }}
                                    >
                                        <PsychologyIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                )}

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        sx={{ mb: 1, textAlign: msg.role === 'user' ? 'right' : 'left' }}
                                    >
                                        {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                                    </Typography>
                                    <Card
                                        sx={{
                                            bgcolor: alpha(msg.role === 'user' ? '#38a169' : '#4299e1', 0.15),
                                            borderRadius: 3,
                                            maxWidth: '80%',
                                            textAlign: 'left',
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="body1">{msg.content}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>

                                {/* User Avatar (Right) */}
                                {msg.role === 'user' && (
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: '#38a169',
                                            boxShadow: '0 4px 14px rgba(56, 161, 105, 0.3)',
                                            ml: 2
                                        }}
                                    >
                                        <SentimentIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                )}
                            </Box>
                        ))}



                        {/* Chatbox for displaying conversation */}
                        {/* <Box sx={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            p: 2,
                            mb: 2
                        }}>
                            {conversation.map((msg, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal' }}>
                                        {msg.role === 'user' ? 'You: ' : 'AI: '}
                                        {msg.content}
                                    </Typography>
                                </Box>
                            ))}
                        </Box> */}

                        {/* User Response Area */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            mb: 4,
                            flexDirection: 'row-reverse'
                        }}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: '#48bb78'
                                }}
                            >
                                U
                            </Avatar>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'right' }}>
                                    Your Response
                                </Typography>
                                <Card sx={{
                                    bgcolor: isRecording ? alpha('#48bb78', 0.05) : '#fff',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: isRecording ? '#48bb78' : 'rgba(0, 0, 0, 0.08)',
                                    width: '100%'
                                }}>
                                    <CardContent>
                                        <Box sx={{
                                            minHeight: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            gap: 2
                                        }}>
                                            {isRecording ? (
                                                <>
                                                    <Box sx={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: '50%',
                                                        bgcolor: alpha('#48bb78', 0.1),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        animation: 'pulse 1.5s infinite'
                                                    }}>
                                                        <MicIcon sx={{ color: '#48bb78', fontSize: 30 }} />
                                                    </Box>
                                                    <Typography color="text.secondary">
                                                        Recording your answer...
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Typography color="text.secondary">
                                                    Click the microphone to start speaking
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>

                        {/* Controls */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            mt: 4
                        }}>
                            <Button
                                variant="contained"
                                startIcon={<MicIcon />}
                                onClick={handleStartRecording}
                                disabled={isConversationActive}
                                sx={{
                                    bgcolor: '#48bb78',
                                    color: '#fff',
                                    '&:hover': {
                                        bgcolor: '#38a169'
                                    },
                                    py: 2,
                                    px: 4,
                                    borderRadius: 3,
                                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                Start Interview Conversation
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Interview Info Panel */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        {/* Timer Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                                bgcolor: '#fff'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2
                            }}>
                                <TimerIcon sx={{ color: '#4299e1' }} />
                                <Typography variant="h6">
                                    Time Remaining
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{
                                fontWeight: 700,
                                color: '#2d3748',
                                textAlign: 'center'
                            }}>
                                02:30
                            </Typography>
                        </Paper>

                        {/* Tips Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'rgba(0, 0, 0, 0.08)',
                                bgcolor: '#fff'
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2
                            }}>
                                <LiveHelpIcon sx={{ color: '#4299e1' }} />
                                <Typography variant="h6">
                                    Interview Tips
                                </Typography>
                            </Box>
                            <Stack spacing={2}>
                                <Typography variant="body2" color="text.secondary">
                                    • Speak clearly and at a moderate pace
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Stay focused on the question asked
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Provide specific examples when possible
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Keep your answers concise but complete
                                </Typography>
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>

            {/* Instructions Dialog */}
            <Dialog
                open={showInstructions}
                onClose={() => setShowInstructions(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <WaveIcon sx={{ color: '#4299e1' }} />
                    Welcome to Your AI Interview
                </DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        You're about to start your AI-powered interview. Here's what you need to know:
                    </Typography>
                    <Stack spacing={2}>
                        <Typography variant="body2">
                            • The AI will conduct a natural conversation with you about your experience
                        </Typography>
                        <Typography variant="body2">
                            • The conversation will continue automatically - just speak naturally
                        </Typography>
                        <Typography variant="body2">
                            • The AI will listen and respond to your answers in real-time
                        </Typography>
                        <Typography variant="body2">
                            • Click the close button (red microphone) when you're done
                        </Typography>
                        <Typography variant="body2">
                            • Speak clearly and the AI will pause while you're thinking
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowInstructions(false)}
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            bgcolor: '#4299e1',
                            '&:hover': {
                                bgcolor: '#3182ce'
                            }
                        }}
                    >
                        Start Interview
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Microphone Permission Dialog */}
            <MicrophonePermission
                open={showPermissionDialog}
                onAllow={handleMicrophoneAllow}
                onDeny={handleMicrophoneDeny}
            />

            {/* Add the RecordingOverlay component */}
            <RecordingOverlay />

            {/* Custom Animation Styles */}
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            filter: drop-shadow(0 0 30px #4299e1);
                        }
                        50% {
                            filter: drop-shadow(0 0 50px #4299e1);
                        }
                        100% {
                            filter: drop-shadow(0 0 30px #4299e1);
                        }
                    }
                `}
            </style>

            {/* Add the confirmation dialog */}
            <Dialog
                open={showEndDialog}
                onClose={() => setShowEndDialog(false)}
            >
                <DialogTitle>End Interview?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to end the interview? This will stop the conversation.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEndDialog(false)}>
                        Continue Interview
                    </Button>
                    <Button
                        onClick={handleConfirmEnd}
                        color="error"
                        variant="contained"
                    >
                        End Interview
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AIInterviewScreen; 
