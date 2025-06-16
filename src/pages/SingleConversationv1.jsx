import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DashboardLayout from "../components/Layout";
import { LBAuth, socketUrl } from "../api";
import { useAuth } from "../App";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Phone,
  Video,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Container = styled.div`
  padding: 0;
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

const MessageStatus = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => {
    switch (props.$status) {
      case "sending":
        return "#71767b";
      case "delivered":
        return "#71767b";
      case "seen":
        return "#1d9bf0";
      default:
        return "#71767b";
    }
  }};
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: #2f3336;
    z-index: 1;
  }
`;

const DateLabel = styled.span`
  background: #000000;
  color: #71767b;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #2f3336;
  z-index: 2;
  position: relative;
`;

const UnreadIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #1d9bf0;
    z-index: 1;
  }
`;

const UnreadLabel = styled.span`
  background: #1d9bf0;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  z-index: 2;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

// Initialize socket outside component to prevent re-initialization
let socket = null;

const SingleConversation = () => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const typingTimeout = useRef(null);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const findUnreadIndex = (messages) => {
    if (!lastSeenMessageId || !currentUser) return -1;

    const lastSeenIndex = messages.findIndex(
      (msg) => msg._id === lastSeenMessageId
    );

    // If no last seen message found, consider all messages as unread
    if (lastSeenIndex === -1) return 0;

    // Find the first unread message (after the last seen message)
    for (let i = lastSeenIndex + 1; i < messages.length; i++) {
      // Only consider messages from other users as unread
      if (messages[i].sender._id !== currentUser._id) {
        return i;
      }
    }

    // No unread messages found
    return -1;
  };

  // Initialize socket connection
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"))?.accessToken;
    if (!socket) {
      socket = io(socketUrl, {
        auth: { token },
      });
    }

    // Load last seen message from localStorage
    const lastSeen = localStorage.getItem(`lastSeen_${conversationId}`);
    if (lastSeen) {
      setLastSeenMessageId(lastSeen);
    }

    return () => {
      // Clean up typing timeout on unmount
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [conversationId]);

  const getTypingDisplayText = () => {
    const typingUsersArray = Array.from(typingUsers);

    if (typingUsersArray.length === 0) return "";

    if (conversation?.isGroup) {
      if (typingUsersArray.length === 1) {
        return `${typingUsersArray[0].split(" ")[0]} is typing...`;
      } else if (typingUsersArray.length === 2) {
        return `${typingUsersArray[0].split(" ")[0]} and ${
          typingUsersArray[1].split(" ")[0]
        } are typing...`;
      } else {
        return `${typingUsersArray.length} people are typing...`;
      }
    } else {
      return "";
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  // FIXED: getMessageStatus function
  // const getMessageStatus = (message) => {
  //   if (!message || message.sender._id !== currentUser._id) return null;

  //   if (message.tempMessage) return "sending";

  //   // Get other participants (excluding current user)
  //   const otherParticipants =
  //     conversation?.participants.filter((p) => p._id !== currentUser._id) || [];

  //   if (otherParticipants.length === 0) return "sent"; // No other participants

  //   const seenBy = message.seenBy || [];
  //   const deliveredTo = message.deliveredTo || [];

  //   console.log("Message status check:", {
  //     messageId: message._id,
  //     otherParticipants: otherParticipants.map((p) => p._id),
  //     seenBy,
  //     deliveredTo,
  //   });

  //   // Check if seen by ALL other participants
  //   const unseenParticipants = otherParticipants.filter(
  //     (p) => !seenBy.includes(p._id)
  //   );

  //   if (unseenParticipants.length === 0) {
  //     return "seen"; // All participants have seen it
  //   }

  //   // Check if delivered to ALL other participants
  //   const undeliveredParticipants = otherParticipants.filter(
  //     (p) => !deliveredTo.includes(p._id)
  //   );

  //   if (undeliveredParticipants.length === 0) {
  //     return "delivered"; // All participants received it but not all seen
  //   }

  //   // Check if delivered to SOME participants
  //   if (deliveredTo.length > 0) {
  //     return "delivered"; // Partially delivered
  //   }

  //   return "sent"; // Just sent, not delivered yet
  // };

  // Fetch conversation data and set up socket listeners
  useEffect(() => {
    if (conversationId && socket && currentUser) {
      fetchConversation();

      // Join the conversation room
      socket.emit("joinConversation", conversationId);

      // Set up socket event listeners
      const handleTyping = (data) => {
        const { userName } = data;
        console.log(data);
        // Don't show typing indicator for current user
        if (userName !== currentUser.name) {
          setTypingUsers((prev) => new Set([...prev, userName]));
        }
      };

      const handleStopTyping = (data) => {
        const { userName } = data;
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userName);
          return newSet;
        });
      };

      const handleNewMessage = (message) => {
        console.log("Received new message:", message);

        // Add message to local state (this handles both sent and received messages)
        setMessages((prev) => {
          // Remove any temporary message with same content (optimistic update)
          const filteredMessages = prev.filter(
            (msg) =>
              !(
                msg.tempMessage &&
                msg.content === message.content &&
                msg.sender._id === message.sender._id
              )
          );

          // Check if the actual message already exists to avoid duplicates
          const messageExists = filteredMessages.some(
            (msg) => msg._id === message._id
          );
          if (messageExists) return prev;

          return [...filteredMessages, message];
        });

        // Update conversation with new message
        setConversation((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), message],
          };
        });

        // Remove sender from typing users when they send a message
        if (message.sender?.name) {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(message.sender.name);
            return newSet;
          });
        }

        // Reset sending state if this was our message
        if (message.sender?._id === currentUser._id) {
          setSending(false);
        }
      };

      const handleMessageDelivered = (data) => {
        const { messageId, userId } = data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, deliveredTo: [...(msg.deliveredTo || []), userId] }
              : msg
          )
        );
      };

      const handleMessageSeen = (data) => {
        const { messageId, userId } = data;
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, seenBy: [...(msg.seenBy || []), userId] }
              : msg
          )
        );
      };

      // Add this new event listener in your useEffect where you set up socket listeners
      const handleMessageUpdated = (updatedMessage) => {
        console.log("Message updated:", updatedMessage);
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      };

      // Add to your socket event listeners
      socket.on("messageUpdated", handleMessageUpdated);

      // Add event listeners
      socket.on("typing", handleTyping);
      socket.on("stopTyping", handleStopTyping);
      socket.on("newMessage", handleNewMessage);
      socket.on("messageDelivered", handleMessageDelivered);
      socket.on("messageSeen", handleMessageSeen);

      // Cleanup function
      return () => {
        socket.off("typing", handleTyping);
        socket.off("stopTyping", handleStopTyping);
        socket.off("newMessage", handleNewMessage);
        socket.off("messageDelivered", handleMessageDelivered);
        socket.off("messageSeen", handleMessageSeen);

        // Leave the conversation room
        socket.emit("leaveConversation", conversationId);
        // Don't forget to clean up in the return statement
        // ... existing cleanup
        socket.off("messageUpdated", handleMessageUpdated);

        // Clear typing users
        setTypingUsers(new Set());
      };
    }
  }, [conversationId, currentUser]);

  // Mark messages as seen when they come into view
  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      const lastMessage = messages[messages.length - 1];

      // Only mark as seen if it's not our own message and we haven't seen it yet
      if (
        lastMessage.sender._id !== currentUser._id &&
        (!lastMessage.seenBy || !lastMessage.seenBy.includes(currentUser._id))
      ) {
        // Mark message as seen
        socket?.emit("markMessageSeen", {
          messageId: lastMessage._id,
          conversationId,
          userId: currentUser._id,
        });

        // Update last seen message
        setLastSeenMessageId(lastMessage._id);
        localStorage.setItem(`lastSeen_${conversationId}`, lastMessage._id);
      }
    }
  }, [messages, currentUser, conversationId]);

  // Helper functions for date grouping and message status
  const formatDateGroup = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to start of day for comparison
    const resetTime = (d) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const messageDateReset = resetTime(messageDate);
    const todayReset = resetTime(today);
    const yesterdayReset = resetTime(yesterday);

    if (messageDateReset.getTime() === todayReset.getTime()) {
      return "Today";
    } else if (messageDateReset.getTime() === yesterdayReset.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getMessageStatus = (message) => {
    if (!message || message.sender._id !== currentUser._id) return null;

    if (message.tempMessage) return "sending";

    const otherParticipants =
      conversation?.participants.filter((p) => p._id !== currentUser._id) || [];
    const seenBy = message.seenBy || [];
    const deliveredTo = message.deliveredTo || [];

    // Check if seen by all other participants
    const allSeen = otherParticipants.every((p) => seenBy.includes(p._id));
    if (allSeen && otherParticipants.length > 0) return "seen";

    // Check if delivered to all other participants
    const allDelivered = otherParticipants.every((p) =>
      deliveredTo.includes(p._id)
    );
    if (allDelivered && otherParticipants.length > 0) return "delivered";

    // If some delivered but not all, still show delivered
    if (deliveredTo.length > 0) return "delivered";

    return "sent";
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case "sending":
        return <Clock size={12} />;
      case "sent":
        return <Check size={12} />;
      case "delivered":
        return <CheckCheck size={12} />;
      case "seen":
        return <CheckCheck size={12} style={{ color: "#1d9bf0" }} />;
      default:
        return null;
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();

      if (currentDate !== messageDate) {
        if (currentGroup.length > 0) {
          groups.push({
            date: currentDate,
            messages: currentGroup,
          });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({
        date: currentDate,
        messages: currentGroup,
      });
    }

    return groups;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await LBAuth.get(`/conversations/${conversationId}`);
      const data = response.data;
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

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessageText(value);
    adjustTextareaHeight();

    if (!socket || !currentUser || !conversationId) return;

    // Only emit typing if user is actually typing (has content)
    if (value.trim()) {
      socket.emit("typing", {
        conversationId,
        userName: currentUser.name,
      });

      // Clear existing timeout and set new one
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", {
          conversationId,
          userName: currentUser.name,
        });
      }, 1500);
    } else {
      // If input is empty, stop typing immediately
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      socket.emit("stopTyping", {
        conversationId,
        userName: currentUser.name,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || sending || !socket || !currentUser) return;

    // Stop typing indicator immediately
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    socket.emit("stopTyping", {
      conversationId,
      userName: currentUser.name,
    });

    const messageData = {
      conversationId,
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
      },
      content: messageText.trim(),
      createdAt: new Date().toISOString(),
    };

    setSending(true);

    // Add temporary message for immediate UI feedback
    const tempMessage = {
      ...messageData,
      _id: `temp_${Date.now()}_${Math.random()}`, // Unique temporary ID
      tempMessage: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // Send message via socket - the real message will come back via newMessage event
    socket.emit("sendMessage", messageData);
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
            (() => {
              const messageGroups = groupMessagesByDate(messages);
              const unreadIndex = findUnreadIndex(messages);
              let messageIndex = 0;

              return messageGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <DateDivider>
                    <DateLabel>
                      {formatDateGroup(new Date(group.date))}
                    </DateLabel>
                  </DateDivider>

                  {group.messages.map((message, msgIndex) => {
                    const currentMessageIndex = messageIndex++;
                    const isOwn = message.sender._id === currentUser._id;
                    const showSender = !isOwn && conversation.isGroup;
                    const messageStatus = getMessageStatus(message);

                    return (
                      <div key={message._id || currentMessageIndex}>
                        {/* Show unread indicator */}
                        {currentMessageIndex === unreadIndex && (
                          <UnreadIndicator>
                            <UnreadLabel>
                              {
                                messages
                                  .slice(unreadIndex)
                                  .filter(
                                    (m) => m.sender._id !== currentUser._id
                                  ).length
                              }{" "}
                              New Message
                              {messages
                                .slice(unreadIndex)
                                .filter((m) => m.sender._id !== currentUser._id)
                                .length > 1
                                ? "s"
                                : ""}
                            </UnreadLabel>
                          </UnreadIndicator>
                        )}

                        <MessageGroup $isOwn={isOwn}>
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
                            {isOwn && messageStatus && (
                              <MessageStatus $status={messageStatus}>
                                {renderMessageStatus(messageStatus)}
                              </MessageStatus>
                            )}
                          </MessageInfo>
                        </MessageGroup>
                      </div>
                    );
                  })}
                </div>
              ));
            })()
          )}

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
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
              onChange={handleTyping}
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
