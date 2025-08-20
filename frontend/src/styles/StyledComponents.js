// Styled components for consistent styling across the app
import styled from 'styled-components';
import config from '../config';

// Main container for the chat application
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  background: ${config.COLORS.background};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 600px) {
    max-width: 100%;
    height: 100%;
  }
`;

// Header section
export const ChatHeader = styled.div`
  background: linear-gradient(135deg, ${config.COLORS.secondary} 0%, ${config.COLORS.secondary}dd 100%);
  color: ${config.COLORS.primary};
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  p {
    margin: 5px 0 0 0;
    font-size: 14px;
    opacity: 0.9;
    color: ${config.COLORS.accent};
  }
`;

// Messages container
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(to bottom, ${config.COLORS.accent}22 0%, ${config.COLORS.background} 100%);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${config.COLORS.accent}44;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${config.COLORS.secondary}66;
    border-radius: 4px;
    
    &:hover {
      background: ${config.COLORS.secondary}99;
    }
  }
`;

// Individual message bubble
export const MessageBubble = styled.div`
  display: flex;
  margin-bottom: 15px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Message content styling
export const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.5;
  
  ${props => props.$isUser ? `
    margin-left: auto;
    background: ${config.COLORS.primary};
    color: ${config.COLORS.secondary};
    border-bottom-right-radius: 4px;
  ` : `
    margin-right: auto;
    background: ${config.COLORS.secondary};
    color: ${config.COLORS.accent};
    border-bottom-left-radius: 4px;
  `}
  
  .message-text {
    p {
      margin: 8px 0;
      line-height: 1.6;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    h4 {
      margin: 12px 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: ${props => props.$isUser ? config.COLORS.secondary : config.COLORS.primary};
    }
    
    strong {
      font-weight: 600;
      color: ${props => props.$isUser ? config.COLORS.secondary : '#FFFFFF'};
    }
    
    ul, ol {
      margin: 8px 0;
      padding-left: 20px;
      
      li {
        margin: 4px 0;
        line-height: 1.5;
      }
    }
  }
`;

// Input container at the bottom
export const InputContainer = styled.div`
  display: flex;
  padding: 20px;
  background: ${config.COLORS.background};
  border-top: 1px solid ${config.COLORS.accent}66;
  gap: 10px;
`;

// Text input field
export const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${config.COLORS.accent};
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: ${config.COLORS.primary};
  }
  
  &::placeholder {
    color: #999;
  }
`;

// Send button
export const SendButton = styled.button`
  padding: 12px 24px;
  background: ${config.COLORS.primary};
  color: ${config.COLORS.secondary};
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: ${config.COLORS.secondary};
    color: ${config.COLORS.primary};
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Connection status indicator
export const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.$connected ? config.COLORS.success : config.COLORS.error}22;
  color: ${props => props.$connected ? config.COLORS.success : config.COLORS.error};
  font-size: 14px;
  border-radius: 20px;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: ${props => props.$connected ? 'pulse' : 'none'} 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// Typing indicator
export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 15px;
  background: ${config.COLORS.secondary}22;
  border-radius: 18px;
  max-width: 60px;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${config.COLORS.secondary};
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

// Reservation confirmation card
export const ReservationCard = styled.div`
  background: linear-gradient(135deg, ${config.COLORS.primary}22 0%, ${config.COLORS.accent}44 100%);
  border: 2px solid ${config.COLORS.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
  
  h3 {
    color: ${config.COLORS.secondary};
    margin: 0 0 12px 0;
    font-size: 18px;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid ${config.COLORS.accent};
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 600;
      color: ${config.COLORS.secondary}cc;
    }
    
    .value {
      color: ${config.COLORS.secondary};
    }
  }
  
  .status {
    display: inline-block;
    padding: 4px 12px;
    background: ${config.COLORS.success};
    color: white;
    border-radius: 12px;
    font-size: 14px;
    margin-top: 12px;
  }
`;