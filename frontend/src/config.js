// Configuration for our application
const config = {
  // Backend URL - change this if your backend runs on a different port
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  
  // Restaurant Information
  RESTAURANT_NAME: 'The Golden Fork',
  
  // Color Scheme
  COLORS: {
    primary: '#FFD700',      // Gold
    secondary: '#3E2723',    // Dark Brown
    accent: '#FFF8DC',       // Cream
    text: '#333333',         // Dark Gray
    background: '#FFFFFF',   // White
    error: '#FF5252',        // Red
    success: '#4CAF50',      // Green
  }
};

export default config;