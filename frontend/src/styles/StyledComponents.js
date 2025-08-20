// Styled components for consistent styling across the app
import styled from 'styled-components';
import config from '../config';

// Main container for the chat application
export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-width: 450px;
  margin: 0 auto;
  background: ${config.COLORS.background};
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  box-shadow: 0 10px 40px ${config.COLORS.shadow}, 
              0 0 1px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 600px) {
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
  }
`;

// Header section
export const ChatHeader = styled.div`
  background: ${config.COLORS.gradient};
  color: white;
  padding: 20px;
  box-shadow: 0 2px 15px rgba(123, 63, 242, 0.15);
  position: relative;
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .bot-icon {
      width: 45px;
      height: 45px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .bot-info {
      flex: 1;
      
      h1 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      
      p {
        margin: 2px 0 0 0;
        font-size: 13px;
        opacity: 0.9;
      }
    }
  }
`;

// Connection status indicator - updated to match reference
export const ConnectionStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$connected ? config.COLORS.online : config.COLORS.error};
    box-shadow: ${props => props.$connected ? 
      `0 0 0 2px rgba(16, 185, 129, 0.2)` : 
      `0 0 0 2px rgba(239, 68, 68, 0.2)`};
    animation: ${props => props.$connected ? 'pulse' : 'none'} 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

// Messages container
export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: ${config.COLORS.chatBg};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

// Individual message bubble
export const MessageBubble = styled.div`
  display: flex;
  margin-bottom: 16px;
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

// Message content styling - updated to match reference
export const MessageContent = styled.div`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 14px;
  
  ${props => props.$isUser ? `
    margin-left: auto;
    background: ${config.COLORS.userMessage};
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(123, 63, 242, 0.15);
  ` : `
    margin-right: auto;
    background: ${config.COLORS.botMessage};
    color: ${config.COLORS.text};
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
      font-size: 15px;
      font-weight: 600;
      color: ${props => props.$isUser ? 'white' : config.COLORS.primary};
    }
    
    strong {
      font-weight: 600;
      color: ${props => props.$isUser ? 'white' : config.COLORS.text};
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

// Input container at the bottom - square corners to match reference
export const InputContainer = styled.div`
  display: flex;
  padding: 16px 20px 20px;
  background: ${config.COLORS.background};
  gap: 10px;
  border-top: 1px solid ${config.COLORS.inputBorder};
`;

// Text input field - updated to match reference
export const MessageInput = styled.input`
  flex: 1;
  padding: 11px 16px;
  border: 1px solid ${config.COLORS.inputBorder};
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background: ${config.COLORS.inputBg};
  color: ${config.COLORS.text};
  
  &:focus {
    border-color: ${config.COLORS.primary};
    background: white;
    box-shadow: 0 0 0 3px rgba(91, 95, 207, 0.1);
  }
  
  &::placeholder {
    color: ${config.COLORS.textLight};
  }
`;

// Send button - updated to match reference style
export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  background: ${config.COLORS.gradient};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(123, 63, 242, 0.25);
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(123, 63, 242, 0.35);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::after {
    content: '➤';
    font-size: 16px;
  }
`;

// Typing indicator - updated colors
export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 15px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  max-width: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${config.COLORS.textLight};
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
      opacity: 0.4;
    }
    30% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }
`;

// Reservation confirmation card - updated colors
export const ReservationCard = styled.div`
  background: linear-gradient(135deg, rgba(91, 95, 207, 0.05) 0%, rgba(123, 63, 242, 0.05) 100%);
  border: 1.5px solid ${config.COLORS.primary};
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
  
  h3 {
    color: ${config.COLORS.primary};
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(91, 95, 207, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: 500;
      color: ${config.COLORS.textLight};
      font-size: 14px;
    }
    
    .value {
      color: ${config.COLORS.text};
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  .status {
    display: inline-block;
    padding: 6px 14px;
    background: ${config.COLORS.success};
    color: white;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 500;
    margin-top: 12px;
  }
`;