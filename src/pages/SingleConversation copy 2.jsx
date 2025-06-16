import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DashboardLayout from "../components/Layout";
import { LBAuth } from "../api";
import { useAuth } from "../App";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
  background: #000000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #16181c;
  border-bottom: 1px solid #2f3336;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #71767b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #2f3336;
    color: #ffffff;
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
`;

const ParticipantStatus = styled.p`
  font-size: 14px;
  color: #71767b;
  margin: 0;
`;

const GroupBadge = styled.span`
  background: linear-gradient(135deg, #1d9bf0, #8b5cf6);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #71767b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #2f3336;
    color: #ffffff;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #000000;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${(props) => (props.$isOwn ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  position: relative;

  ${(props) =>
    props.$isOwn
      ? `
    background: #1d9bf0;
    color: #ffffff;
    border-bottom-right-radius: 6px;
  `
      : `
    background: #16181c;
    color: #ffffff;
    border: 1px solid #2f3336;
    border-bottom-left-radius: 6px;
  `}
`;

const MessageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: #71767b;
  ${(props) => (props.$isOwn ? "justify-content: flex-end;" : "")}
`;

const SenderName = styled.span`
  font-weight: 600;
  color: #1d9bf0;
`;

const MessageTime = styled.span`
  color: #71767b;
`;

const SeenIndicator = styled.span`
  color: #1d9bf0;
  font-size: 11px;
`;

const InputContainer = styled.div`
  padding: 16px 24px;
  background: #16181c;
  border-top: 1px solid #2f3336;
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

const MessageInputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 20px;
  max-height: 120px;
  padding: 12px 16px;
  border: 1px solid #2f3336;
  border-radius: 20px;
  font-size: 14px;
  background-color: #000000;
  color: #ffffff;
  resize: none;
  line-height: 1.4;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2);
  }

  &::placeholder {
    color: #71767b;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #2f3336;
    border-radius: 2px;
  }
`;

const SendButton = styled.button`
  background: ${(props) => (props.$hasContent ? "#1d9bf0" : "#2f3336")};
  border: none;
  color: ${(props) => (props.$hasContent ? "#ffffff" : "#71767b")};
  cursor: ${(props) => (props.$hasContent ? "pointer" : "not-allowed")};
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 44px;
  height: 44px;

  &:hover {
    background: ${(props) => (props.$hasContent ? "#1a8cd8" : "#2f3336")};
    transform: ${(props) => (props.$hasContent ? "scale(1.05)" : "none")};
  }

  &:active {
    transform: ${(props) => (props.$hasContent ? "scale(0.95)" : "none")};
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
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

const TypingBubble = styled.div`
  background: #16181c;
  border: 1px solid #2f3336;
  border-radius: 18px;
  border-bottom-left-radius: 6px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: fit-content;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #71767b;
  border-radius: 50%;
  animation: typingAnimation 1.4s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typingAnimation {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

const TypingText = styled.span`
  font-size: 12px;
  color: #71767b;
  margin-left: 4px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;

  &::after {
    content: "";
    width: 32px;
    height: 32px;
    border: 3px solid #2f3336;
    border-top: 3px solid #1d9bf0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #71767b;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
`;

const SingleConversation = () => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  // Fetch conversation data
  useEffect(() => {
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  // Scroll to bottom when messages change or when typing status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Handle typing indicator
  useEffect(() => {
    // Mock typing users for demonstration
    // In a real app, this would come from WebSocket/Socket.IO
    const mockTyping = () => {
      if (Math.random() > 0.7) {
        // 30% chance of someone typing
        const otherParticipants = getOtherParticipants();
        if (otherParticipants.length > 0) {
          const randomUser =
            otherParticipants[
              Math.floor(Math.random() * otherParticipants.length)
            ];
          setTypingUsers([randomUser]);

          // Stop typing after 2-5 seconds
          setTimeout(() => {
            setTypingUsers([]);
          }, 2000 + Math.random() * 3000);
        }
      }
    };

    // Start random typing events every 10-20 seconds
    const interval = setInterval(mockTyping, 10000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, [conversation]);

  // Handle user typing state
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      // In a real app, emit typing event to other users via WebSocket
      console.log("User started typing");
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log("User stopped typing");
    }, 2000);
  };

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await LBAuth.get(`/conversations/${conversationId}`);
      const data = await response.data;
      setConversation(data);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    adjustTextareaHeight();
    handleTypingStart(); // Trigger typing indicator
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    try {
      setSending(true);
      setIsTyping(false); // Stop typing when sending
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Create optimistic message
      const optimisticMessage = {
        _id: Date.now().toString(), // temporary ID
        content: messageText.trim(),
        sender: {
          _id: currentUser._id,
          name: currentUser.name,
        },
        createdAt: new Date().toISOString(),
        seenBy: [currentUser._id],
        isOptimistic: true,
      };

      // Add optimistic message to UI
      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageText("");

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      // Send message to backend
      const response = await LBAuth.post(
        `/conversations/${conversationId}/messages`,
        {
          content: messageText.trim(),
        }
      );

      // Replace optimistic message with real one
      const realMessage = response.data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isOptimistic && msg.content === realMessage.content
            ? realMessage
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
      // Restore message text
      setMessageText(messageText);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diffDays === 2) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    if (diffDays <= 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString();
  };

  const getOtherParticipants = () => {
    if (!conversation || !currentUser) return [];
    return conversation.participants.filter((p) => p._id !== currentUser._id);
  };

  const getConversationDisplayInfo = () => {
    if (!conversation || !currentUser) return { name: "", status: "" };

    if (conversation.isGroup) {
      const participantNames = conversation.participants
        .filter((p) => p._id !== currentUser._id)
        .map((p) => p.name.split(" ")[0])
        .join(", ");
      return {
        name: participantNames || "Group Chat",
        status: `${conversation.participants.length} participants`,
      };
    } else {
      const otherParticipant = getOtherParticipants()[0];
      return {
        name: otherParticipant?.name || "Unknown User",
        status: "Online", // You can implement actual online status
      };
    }
  };

  const isMessageSeen = (message) => {
    if (!currentUser || message.sender._id === currentUser._id) return false;
    return message.seenBy && message.seenBy.includes(currentUser._id);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Container>
          <LoadingSpinner />
        </Container>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout>
        <Container>
          <EmptyState>
            <EmptyStateIcon>😕</EmptyStateIcon>
            <h3 style={{ color: "#ffffff", marginBottom: "8px" }}>
              Conversation not found
            </h3>
            <p>
              This conversation may have been deleted or you don't have access
              to it.
            </p>
          </EmptyState>
        </Container>
      </DashboardLayout>
    );
  }

  const displayInfo = getConversationDisplayInfo();

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton onClick={() => navigate("/conversations")}>
              <ArrowLeft size={20} />
            </BackButton>
            <ParticipantInfo>
              <ParticipantName>
                {displayInfo.name}
                {conversation.isGroup && <GroupBadge>Group</GroupBadge>}
              </ParticipantName>
              <ParticipantStatus>{displayInfo.status}</ParticipantStatus>
            </ParticipantInfo>
          </HeaderLeft>
          <HeaderRight>
            <ActionButton>
              <Phone size={18} />
            </ActionButton>
            <ActionButton>
              <Video size={18} />
            </ActionButton>
            <ActionButton>
              <MoreVertical size={18} />
            </ActionButton>
          </HeaderRight>
        </Header>

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>💬</EmptyStateIcon>
              <h3 style={{ color: "#ffffff", marginBottom: "8px" }}>
                No messages yet
              </h3>
              <p>Start the conversation by sending a message!</p>
            </EmptyState>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender._id === currentUser._id;
              const showSender = !isOwn && conversation.isGroup;

              return (
                <MessageGroup key={message._id} $isOwn={isOwn}>
                  <MessageBubble $isOwn={isOwn}>
                    {message.content}
                  </MessageBubble>
                  <MessageInfo $isOwn={isOwn}>
                    {showSender && (
                      <SenderName>
                        {message.sender.name.split(" ")[0]}
                      </SenderName>
                    )}
                    <MessageTime>
                      {formatMessageTime(message.createdAt)}
                    </MessageTime>
                    {isOwn && isMessageSeen(message) && (
                      <SeenIndicator>Seen</SeenIndicator>
                    )}
                  </MessageInfo>
                </MessageGroup>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator>
              <TypingBubble>
                <TypingDot />
                <TypingDot />
                <TypingDot />
                <TypingText>{getTypingDisplayText()}</TypingText>
              </TypingBubble>
            </TypingIndicator>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <MessageInputWrapper>
            <MessageInput
              ref={inputRef}
              value={messageText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
            />
          </MessageInputWrapper>
          <SendButton
            $hasContent={messageText.trim().length > 0}
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sending}
          >
            <Send size={18} />
          </SendButton>
        </InputContainer>
      </Container>
    </DashboardLayout>
  );
};

export default SingleConversation;
