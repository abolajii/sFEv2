import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DashboardLayout from "../components/Layout";
import { LBAuth, socketUrl } from "../api";
import { useAuth } from "../App";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { format } from "date-fns";

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #000000;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
`;

const Subtitle = styled.p`
  color: #71767b;
  font-size: 16px;
  font-weight: 400;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #2f3336;
  border-radius: 12px;
  font-size: 16px;
  background-color: #16181c;
  color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #1d9bf0;
    box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2);
  }

  &::placeholder {
    color: #71767b;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #71767b;
`;

// const ConversationList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

const ConversationItem = styled.div`
  background: #16181c;
  border: 1px solid #2f3336;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1d9bf0;
    box-shadow: 0 0 0 1px rgba(29, 155, 240, 0.2);
    background: #1a1d23;
  }
`;

const ConversationItemAnimated = styled(ConversationItem)`
  position: relative;

  /* Default state */
  &[data-just-updated="true"] {
    animation: slideToTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    z-index: 10;
  }

  /* Keyframe animation */
  @keyframes slideToTop {
    0% {
      transform: translateY(${(props) => (props.$originalIndex || 0) * 124}px)
        scale(1);
      box-shadow: none;
    }
    50% {
      box-shadow: 0 8px 32px rgba(29, 155, 240, 0.3);
    }
    100% {
      transform: translateY(0) scale(1);
      box-shadow: 0 2px 8px rgba(29, 155, 240, 0.1);
    }
  }
`;

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ParticipantInfo = styled.div`
  flex: 1;
`;

const ParticipantName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

const ParticipantEmail = styled.p`
  font-size: 14px;
  color: #71767b;
  margin: 0;
`;

const ConversationMeta = styled.div`
  text-align: right;
`;

const LastMessageTime = styled.span`
  font-size: 12px;
  color: #71767b;
  font-weight: 500;
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

const LastMessage = styled.div`
  /* margin-top: 12px; */
  /* padding-top: 12px; */
  /* border-top: 1px solid #2f3336; */
`;

const LastMessageText = styled.p`
  font-size: 14px;
  color: #71767b;
  margin: 0;
  line-height: 1.5;
  font-weight: ${(props) => (props.$isUnread ? "600" : "400")};
  color: ${(props) => (props.$isUnread ? "#ffffff" : "#71767b")};
`;

const SenderPrefix = styled.span`
  color: #1d9bf0;
  font-weight: 600;
`;

const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  background-color: #1d9bf0;
  border-radius: 50%;
  margin-left: 8px;
  flex-shrink: 0;
`;

const UnreadCount = styled.span`
  background-color: #1d9bf0;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  min-width: 18px;
  text-align: center;
  flex-shrink: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #71767b;
  background: #16181c;
  border-radius: 16px;
  border: 1px solid #2f3336;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
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

const TypingIndicator = styled.div`
  font-size: 14px;
  color: #1d9bf0;
  font-style: italic;
  margin: 0;
  line-height: 1.5;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

// Initialize socket outside component to prevent re-initialization
let socket = null;

const Conversation = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // State to track typing users per conversation
  const [typingUsers, setTypingUsers] = useState({}); // { conversationId: Set of userNames }

  // Enhanced typing event handler
  // Handle user started typing
  const handleTyping = (data) => {
    const { userName, userId, conversationId } = data;

    // Don't show typing indicator for current user
    if (userId === currentUser?._id || userName === currentUser?.name) {
      return;
    }

    console.log("User started typing:", { userName, userId, conversationId });

    setTypingUsers((prev) => {
      const newTypingUsers = { ...prev };

      if (!newTypingUsers[conversationId]) {
        newTypingUsers[conversationId] = new Set();
      }

      newTypingUsers[conversationId].add(userName);
      return newTypingUsers;
    });

    // Auto-clear typing indicator after timeout (safety net)
    setTimeout(() => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        if (newTypingUsers[conversationId]) {
          newTypingUsers[conversationId].delete(userName);
          if (newTypingUsers[conversationId].size === 0) {
            delete newTypingUsers[conversationId];
          }
        }
        return newTypingUsers;
      });
    }, 5000); // 5 seconds timeout
  };

  // Handle user stopped typing
  const handleStopTyping = (data) => {
    const { userName, userId, conversationId } = data;

    // Don't process for current user
    if (userId === currentUser?._id || userName === currentUser?.name) {
      return;
    }

    console.log("User stopped typing:", { userName, userId, conversationId });

    setTypingUsers((prev) => {
      const newTypingUsers = { ...prev };

      if (newTypingUsers[conversationId]) {
        newTypingUsers[conversationId].delete(userName);
        if (newTypingUsers[conversationId].size === 0) {
          delete newTypingUsers[conversationId];
        }
      }

      return newTypingUsers;
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"))?.accessToken;
    if (!socket) {
      socket = io(socketUrl, {
        auth: { token },
      });
    }
  }, []);

  // // Fetch conversations on component mount
  // useEffect(() => {
  //   console.log("typing...");
  //   socket.on("typing", handleTyping);

  //   return () => {
  //     socket.off("typing", handleTyping);
  //   };
  // }, [currentUser]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket || !currentUser) return;

    console.log("Setting up typing event listeners...");

    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);

      setConversations((prev) => {
        const updatedConversationIndex = prev.findIndex(
          (conv) => conv._id === newMessage.conversation
        );

        if (updatedConversationIndex === -1) return prev;

        const updatedConversation = {
          ...prev[updatedConversationIndex],
          lastMessage: newMessage,
          updatedAt: newMessage.createdAt,
          justUpdated: true,
          originalIndex: updatedConversationIndex,
        };

        // Always reorder immediately, CSS will handle the animation
        const reorderedConversations = [
          updatedConversation,
          ...prev.slice(0, updatedConversationIndex),
          ...prev.slice(updatedConversationIndex + 1),
        ];

        // Clear the animation flag after animation duration
        setTimeout(() => {
          setConversations((current) =>
            current.map((conv) => ({
              ...conv,
              justUpdated: false,
              originalIndex: undefined,
            }))
          );
        }, 800); // Slightly longer than animation duration

        return reorderedConversations;
      });
    });

    // Listen for typing events (user started typing)
    socket.on("typing", handleTyping);

    // Listen for stop typing events (user stopped typing)
    socket.on("stopTyping", handleStopTyping);

    // Join all conversation rooms when conversations are loaded
    conversations.forEach((conversation) => {
      socket.emit("joinConversation", conversation._id);
      console.log(`Joining conversation room: ${conversation._id}`);
    });

    return () => {
      socket.off("typing", handleTyping);
      socket.off("newMessage");
      socket.off("stopTyping", handleStopTyping);
    };
  }, [currentUser, conversations]);
  // Filter conversations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter((conversation) =>
        conversation.participants.some(
          (participant) =>
            participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredConversations(filtered);
    }
  }, [searchTerm, conversations]);

  // Helper function to get typing indicator text
  // Helper function to get typing indicator text
  const getTypingIndicator = (conversationId) => {
    const typingUsersSet = typingUsers[conversationId];
    if (!typingUsersSet || typingUsersSet.size === 0) {
      return null;
    }

    const typingUserNames = Array.from(typingUsersSet);

    if (typingUserNames.length === 1) {
      return `typing...`;
    } else if (typingUserNames.length === 2) {
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      return `${typingUserNames.length} people are typing...`;
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await LBAuth.get("/conversations");
      const data = await response.data;
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    // const date = new Date(dateString);
    // const now = new Date();
    // const diffTime = Math.abs(now - date);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // if (diffDays === 1) return "Today";
    // if (diffDays === 2) return "Yesterday";
    // if (diffDays <= 7) return `${diffDays} days ago`;

    // return date.toLocaleDateString();

    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return `Today at ${format(date, "h:mmaaa")}`; // e.g., "Today at 3:00PM"
    } else if (isYesterday) {
      return `Yesterday at ${format(date, "h:mmaaa")}`;
    } else {
      return format(date, "dd MMM, yyyy 'at' h:mmaaa"); // e.g., "14 Jun, 2025 at 2:30PM"
    }
  };

  const getOtherParticipants = (participants, currentUserId) => {
    return participants.filter((p) => p._id !== currentUserId);
  };

  const getLastMessageDisplay = (conversation, currentUserId) => {
    if (!conversation.lastMessage) {
      return "No messages yet";
    }

    const { content, sender } =
      conversation.lastMessage !== null
        ? conversation.lastMessage
        : {
            content: "",
            sender: "",
          };
    const isCurrentUser = sender === currentUserId;

    if (conversation.isGroup) {
      if (isCurrentUser) {
        return (
          <>
            <SenderPrefix>You:</SenderPrefix> {content}
          </>
        );
      } else {
        const senderParticipant = conversation.participants.find(
          (p) => p._id === sender
        );
        const senderName = senderParticipant
          ? senderParticipant.name.split(" ")[0]
          : "Unknown";
        return (
          <>
            <SenderPrefix>{senderName}:</SenderPrefix> {content}
          </>
        );
      }
    } else {
      // For one-on-one conversations
      if (isCurrentUser) {
        return (
          <>
            <SenderPrefix>You:</SenderPrefix> {content}
          </>
        );
      } else {
        return content;
      }
    }
  };

  const isMessageUnread = (conversation, currentUserId) => {
    if (!conversation.lastMessage) {
      return false;
    }

    const { sender, seenBy } = conversation.lastMessage;
    const isCurrentUser = sender === currentUserId;

    // If current user sent the message, it's considered "read"
    if (isCurrentUser) {
      return false;
    }

    // Check if current user has seen the message
    return !seenBy.includes(currentUserId);
  };

  const getUnreadMessageCount = (conversation, currentUserId) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 0;
    }

    // Count messages where current user is not in seenBy array and didn't send the message
    const unreadCount = conversation.messages.filter((message) => {
      const isCurrentUserSender = message.sender === currentUserId;
      const hasSeenMessage =
        message.seenBy && message.seenBy.includes(currentUserId);

      // Message is unread if: current user didn't send it AND hasn't seen it
      return !isCurrentUserSender && !hasSeenMessage;
    }).length;

    return unreadCount;
  };

  const handleConversationClick = (conversationId) => {
    // Navigate to conversation detail page
    console.log("Navigate to conversation:", conversationId);
    // You can implement navigation here using your router
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Conversations</Title>
          <Subtitle>Manage your conversations and messages</Subtitle>
        </Header>

        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search conversations by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ConversationList>
            {filteredConversations.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>💬</EmptyStateIcon>
                <h3
                  style={{
                    color: "#ffffff",
                    marginBottom: "8px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  No conversations found
                </h3>
                <p style={{ color: "#71767b", margin: "0", fontSize: "14px" }}>
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start a new conversation to get started"}
                </p>
              </EmptyState>
            ) : (
              filteredConversations.map((conversation, index) => {
                const currentUserId = currentUser._id;
                const otherParticipants = getOtherParticipants(
                  conversation.participants,
                  currentUserId
                );

                const isUnread = isMessageUnread(conversation, currentUserId);
                const unreadCount = getUnreadMessageCount(
                  conversation,
                  currentUserId
                );
                const typingIndicator = getTypingIndicator(conversation._id);
                const { content, sender } =
                  conversation.lastMessage !== null
                    ? conversation.lastMessage
                    : {
                        content: "",
                        sender: "",
                      };

                const isCurrentUser = sender === currentUserId;

                // Display logic
                let displayName, displayEmail;
                if (conversation.isGroup) {
                  const participantNames = conversation.participants
                    .filter((p) => p._id !== currentUserId)
                    .map((p) => p.name.split(" ")[0])
                    .join(", ");
                  displayName = participantNames || "Group Chat";
                  displayEmail = `${conversation.participants.length} participants`;
                } else {
                  const displayParticipant =
                    otherParticipants[0] || conversation.participants[0];
                  displayName = displayParticipant?.name || "Unknown User";
                  displayEmail = displayParticipant?.email || "";
                }

                return (
                  <ConversationItemAnimated
                    key={conversation._id}
                    data-just-updated={conversation.justUpdated || false}
                    $originalIndex={conversation.originalIndex}
                    onClick={() => handleConversationClick(conversation._id)}
                  >
                    <ConversationHeader>
                      <ParticipantInfo>
                        <ParticipantName>
                          {displayName}
                          {conversation.isGroup && (
                            <GroupBadge>Group</GroupBadge>
                          )}
                        </ParticipantName>
                      </ParticipantInfo>
                      <ConversationMeta>
                        <LastMessageTime>
                          {formatDate(conversation.updatedAt)}
                        </LastMessageTime>
                      </ConversationMeta>
                    </ConversationHeader>

                    <LastMessage>
                      <MessageContainer>
                        {typingIndicator ? (
                          <TypingIndicator>{typingIndicator}</TypingIndicator>
                        ) : (
                          <LastMessageText $isUnread={isUnread}>
                            {getLastMessageDisplay(conversation, currentUserId)}
                          </LastMessageText>
                        )}
                        {!isCurrentUser && unreadCount > 0 && (
                          <UnreadCount>{unreadCount}</UnreadCount>
                        )}
                      </MessageContainer>
                    </LastMessage>
                  </ConversationItemAnimated>
                );
              })
            )}
          </ConversationList>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Conversation;
