import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Message, { TypingMessage } from './Message';
import websocketService from '../services/websocketService';
import {
  ChatContainer,
  ChatHeader,
  MessagesContainer,
  InputContainer,
  MessageInput,
  SendButton,
  ConnectionStatus
} from '../styles/StyledComponents';

const Chat = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(uuidv4());
  
  // Reference to scroll to bottom
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Set up WebSocket connection when component mounts
  useEffect(() => {
    let isConnecting = false;
    
    // Connect to WebSocket (prevent double connection)
    if (!websocketService.isConnected && !isConnecting) {
      isConnecting = true;
      websocketService.connect().then(() => {
        console.log('Connected to chat server');
      }).catch(error => {
        console.error('Failed to connect:', error);
      }).finally(() => {
        isConnecting = false;
      });
    }
    
    // Handle incoming messages
    const handleMessage = (data) => {
      setIsTyping(false);
      
      // Prevent duplicate messages
      setMessages(prev => {
        const isDuplicate = prev.some(msg => 
          msg.content === data.content && 
          Math.abs(new Date(msg.timestamp) - new Date()) < 1000
        );
        
        if (isDuplicate) return prev;
        
        const newMessage = {
          id: uuidv4(),
          content: data.content,
          type: data.type,
          isUser: false,
          timestamp: new Date(),
          metadata: data.metadata,
          reservation_completed: data.reservation_completed,
          reservation_details: data.reservation_details
        };
        
        return [...prev, newMessage];
      });
    };
    
    // Handle connection status changes
    const handleConnectionChange = (connected) => {
      setIsConnected(connected);
    };
    
    // Register event handlers
    websocketService.onMessage(handleMessage);
    websocketService.onConnectionChange(handleConnectionChange);
    
    // Cleanup when component unmounts
    return () => {
      websocketService.removeMessageHandler(handleMessage);
      websocketService.removeConnectionHandler(handleConnectionChange);
      // Don't disconnect here to prevent reconnection issues
    };
  }, []);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      // Add user message to the list
      const userMessage = {
        id: uuidv4(),
        content: inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to server
      websocketService.sendMessage(inputMessage);
      
      // Clear input and show typing indicator
      setInputMessage('');
      setIsTyping(true);
      
      // Hide typing indicator after timeout (fallback)
      setTimeout(() => {
        setIsTyping(false);
      }, 10000);
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <ChatContainer>
      <ChatHeader>
        <h1>🍴 The Golden Fork</h1>
        <p>Restaurant Reservations & Inquiries</p>
        <ConnectionStatus $connected={isConnected}>
          <span className="dot"></span>
          {isConnected ? 'Connected' : 'Connecting...'}
        </ConnectionStatus>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map(message => (
          <Message
            key={message.id}
            message={message}
            isUser={message.isUser}
          />
        ))}
        
        {isTyping && <TypingMessage />}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <MessageInput
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <SendButton 
          onClick={handleSendMessage}
          disabled={!isConnected || !inputMessage.trim()}
        >
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;