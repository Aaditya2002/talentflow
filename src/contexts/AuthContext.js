import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Get token from localStorage on initial load
const getStoredToken = () => localStorage.getItem('msalToken');
const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('msalToken', token);
    } else {
      localStorage.removeItem('msalToken');
    }
  }, [token]);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (msalInstance) => {
    try {
      // Ensure MSAL is initialized
      await msalInstance.initialize();

      // Login with popup
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["User.Read"],
        prompt: "select_account"
      });

      // Get access token
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: loginResponse.account
      });

      setToken(tokenResponse.accessToken);

      // Get user info
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${tokenResponse.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const userData = await response.json();
      const userProfile = {
        id: userData.id,
        displayName: userData.displayName,
        email: userData.userPrincipalName,
        jobTitle: userData.jobTitle,
      };

      setUser(userProfile);
      navigate('/job-description');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async (msalInstance) => {
    try {
      if (msalInstance) {
        await msalInstance.logoutPopup();
      }
      setUser(null);
      setToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 