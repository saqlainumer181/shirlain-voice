// Configuration for our application
const config = {
  // Backend URL - change this if your backend runs on a different port
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  
  // Restaurant Information
  RESTAURANT_NAME: 'The Golden Fork',
  
  // Color Scheme - Updated to match reference design
  COLORS: {
    primary: '#5B5FCF',      // Primary purple/blue
    secondary: '#7B3FF2',    // Secondary purple
    gradient: 'linear-gradient(135deg, #5B5FCF 0%, #7B3FF2 100%)',
    userMessage: '#7B3FF2',  // User message purple
    botMessage: '#FFFFFF',   // Bot message white
    chatBg: '#F5F5F7',      // Chat background light gray
    text: '#333333',         // Dark text
    textLight: '#6B7280',   // Light gray text
    background: '#FFFFFF',   // White
    inputBg: '#F9FAFB',     // Input background
    inputBorder: '#E5E7EB', // Input border
    online: '#10B981',       // Green for online status
    error: '#EF4444',        // Red
    success: '#10B981',      // Green
    shadow: 'rgba(0, 0, 0, 0.1)',
  }
};

export default config;