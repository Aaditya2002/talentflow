import React, { useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Typography, CircularProgress, Paper, Grid, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  Microsoft as MicrosoftIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || '3f3fab13-4f7d-4494-9edf-24f32e1325b5',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
}));

const BackgroundPattern = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
  `,
  zIndex: 0,
});

const LoginBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: 480,
  textAlign: 'center',
  animation: 'fadeIn 0.5s ease-in-out',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: '#2f2f2f',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#1f1f1f',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  margin: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(msalInstance);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <WorkIcon sx={{ fontSize: 40, color: '#2f2f2f' }} />, title: 'Job Management' },
    { icon: <PeopleIcon sx={{ fontSize: 40, color: '#2f2f2f' }} />, title: 'Candidate Tracking' },
    { icon: <TimelineIcon sx={{ fontSize: 40, color: '#2f2f2f' }} />, title: 'Recruitment Timeline' },
    { icon: <AssessmentIcon sx={{ fontSize: 40, color: '#2f2f2f' }} />, title: 'Skills Assessment' },
  ];

  return (
    <LoginContainer>
      <BackgroundPattern />
      <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <LoginBox elevation={3}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2f2f2f 30%, #1f1f1f 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${pulse} 2s infinite`,
                }}
              >
                Welcome to TalentFlow
              </Typography>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                gutterBottom 
                sx={{ mb: 4 }}
              >
                Streamline your recruitment process with our powerful platform
              </Typography>
              <LoginButton
                variant="contained"
                color="primary"
                onClick={handleLogin}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <MicrosoftIcon />
                  )
                }
              >
                {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
              </LoginButton>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Or connect with us
                </Typography>
                <Box>
                  <SocialButton aria-label="LinkedIn">
                    <LinkedInIcon />
                  </SocialButton>
                  <SocialButton aria-label="GitHub">
                    <GitHubIcon />
                  </SocialButton>
                  <SocialButton aria-label="Twitter">
                    <TwitterIcon />
                  </SocialButton>
                </Box>
              </Box>
            </LoginBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <FeatureCard elevation={2}>
                    <Box sx={{ animation: `${float} 3s ease-in-out infinite`, animationDelay: `${index * 0.2}s` }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      {feature.title}
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LoginContainer>
  );
};

export default Login; 