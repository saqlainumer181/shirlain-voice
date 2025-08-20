import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageBubble, MessageContent, TypingIndicator, ReservationCard } from '../styles/StyledComponents';
import { format } from 'date-fns';

// Component to display a single message
const Message = ({ message, isUser }) => {
  // Check if this message contains reservation details
  const hasReservation = message.reservation_completed && message.reservation_details;
  
  // Function to format the reservation date nicely
  const formatReservationDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, MMMM d, yyyy at h:mm a');
    } catch {
      return dateString;
    }
  };
  
  return (
    <MessageBubble>
      <MessageContent $isUser={isUser}>
        {isUser ? (
          <div className="message-text">{message.content}</div>
        ) : (
          <div className="message-text">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h4 style={{margin: '12px 0 8px 0', color: '#5B5FCF'}}>{children}</h4>,
                h2: ({children}) => <h4 style={{margin: '12px 0 8px 0', color: '#5B5FCF'}}>{children}</h4>,
                h3: ({children}) => <h4 style={{margin: '10px 0 6px 0', color: '#5B5FCF'}}>{children}</h4>,
                p: ({children}) => <p style={{margin: '8px 0'}}>{children}</p>,
                strong: ({children}) => <strong style={{fontWeight: 600, color: '#333333'}}>{children}</strong>,
                ul: ({children}) => <ul style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ul>,
                ol: ({children}) => <ol style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ol>,
                li: ({children}) => <li style={{margin: '4px 0'}}>{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        
        {/* If this message confirms a reservation, show the details */}
        {hasReservation && message.reservation_details.success && (
          <ReservationCard>
            <h3>✅ Reservation Confirmed!</h3>
            {message.metadata && (
              <>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{message.metadata.customer_name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Party Size:</span>
                  <span className="value">{message.metadata.party_size} guests</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date & Time:</span>
                  <span className="value">
                    {formatReservationDate(message.metadata.reservation_datetime)}
                  </span>
                </div>
                {message.metadata.special_requests && (
                  <div className="detail-row">
                    <span className="label">Special Requests:</span>
                    <span className="value">{message.metadata.special_requests}</span>
                  </div>
                )}
              </>
            )}
            <div className="status">Booking Confirmed</div>
          </ReservationCard>
        )}
      </MessageContent>
    </MessageBubble>
  );
};

// PropTypes validation
Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string,
    isUser: PropTypes.bool,
    timestamp: PropTypes.instanceOf(Date),
    metadata: PropTypes.object,
    reservation_completed: PropTypes.bool,
    reservation_details: PropTypes.object
  }).isRequired,
  isUser: PropTypes.bool.isRequired
};

// Component to show typing animation
export const TypingMessage = () => {
  return (
    <MessageBubble>
      <TypingIndicator>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </TypingIndicator>
    </MessageBubble>
  );
};

export default Message;