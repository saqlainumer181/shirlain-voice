// This service handles our WebSocket connection to the backend
import config from '../config';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.isConnected = false;
    this.isConnecting = false;
    this.hasReceivedWelcome = false;
  }

  // Connect to the WebSocket server
  connect() {
    // Prevent multiple connections
    if (this.isConnected || this.isConnecting) {
      return Promise.resolve();
    }
    
    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        // Create WebSocket connection
        this.ws = new WebSocket(config.WS_URL);

        // When connection opens
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.isConnecting = false;
          this.connectionHandlers.forEach(handler => handler(true));
          resolve();
        };

        // When we receive a message
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);
            
            // Skip duplicate welcome messages
            if (data.type === 'system' && data.content.includes('Welcome to The Golden Fork')) {
              if (this.hasReceivedWelcome) {
                console.log('Skipping duplicate welcome message');
                return;
              }
              this.hasReceivedWelcome = true;
            }
            
            // Notify all message handlers
            this.messageHandlers.forEach(handler => handler(data));
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        // When connection closes
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.isConnecting = false;
          this.hasReceivedWelcome = false;
          this.connectionHandlers.forEach(handler => handler(false));
          
          // Try to reconnect after 3 seconds
          setTimeout(() => {
            if (!this.isConnected && !this.isConnecting) {
              console.log('Attempting to reconnect...');
              this.connect();
            }
          }, 3000);
        };

        // When there's an error
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // Send a message to the server
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const data = {
        message: message,
        timestamp: new Date().toISOString()
      };
      this.ws.send(JSON.stringify(data));
      console.log('Sent message:', data);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Register a handler for incoming messages
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  // Register a handler for connection status changes
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);
  }

  // Clean up handlers
  removeMessageHandler(handler) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  removeConnectionHandler(handler) {
    this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
  }

  // Disconnect from the server
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a single instance to use throughout the app
const websocketService = new WebSocketService();
export default websocketService;