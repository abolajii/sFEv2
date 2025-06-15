import React, { useState, useRef } from "react";
import {
  Heart,
  X,
  MessageCircle,
  Send,
  ArrowLeft,
  User,
  MapPin,
} from "lucide-react";
import styled from "styled-components";

// Styled Components
const AppContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0e7ff 100%);
  padding: 1rem;
`;

const HomeContainer = styled(PageContainer)`
  background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0e7ff 100%);
`;

const ConversationsContainer = styled(PageContainer)`
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
`;

const ChatContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-top: 0.5rem;
`;

const CardsContainer = styled.div`
  position: relative;
  height: 24rem;
  margin-bottom: 2rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  position: absolute;
  inset: 0;
  cursor: ${(props) => (props.draggable ? "grab" : "default")};
  transform: ${(props) => props.transform};
  z-index: ${(props) => props.zIndex};
  transition: ${(props) => (props.isDragging ? "none" : "all 0.3s ease-out")};

  &:active {
    cursor: ${(props) => (props.draggable ? "grabbing" : "default")};
  }
`;

const CardContent = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
`;

const CardImage = styled.div`
  height: 16rem;
  position: relative;
  background: linear-gradient(135deg, #f472b6, #a855f7, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarPlaceholder = styled.div`
  width: 8rem;
  height: 8rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

const CardOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  color: white;
`;

const CardName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const CardAge = styled.p`
  color: rgba(255, 255, 255, 0.9);
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #6b7280;
`;

const LocationText = styled.span`
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

const Bio = styled.p`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 28rem;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  width: 4rem;
  height: 4rem;
  background: white;
  border-radius: 50%;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(props) => props.borderColor || "#fecaca"};
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const BottomNav = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  max-width: 28rem;
  margin: 0 auto;
`;

const NavContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  padding: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const NavButton = styled.button`
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.2s;
  background: ${(props) =>
    props.active ? "linear-gradient(135deg, #ec4899, #a855f7)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  border: none;
  cursor: pointer;
`;

const ConversationsList = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConversationItem = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &:hover {
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }
`;

const ConversationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ConversationAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #f472b6, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConversationDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationMessage = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationTime = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ChatHeader = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 28rem;
  margin: 0 auto;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const ChatAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #f472b6, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatUserInfo = styled.div``;

const ChatUserName = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.125rem;
`;

const ChatUserStatus = styled.p`
  font-size: 0.75rem;
  color: #10b981;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 28rem;
  margin: 0 auto;
  width: 100%;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.isCurrentUser ? "flex-end" : "flex-start"};
`;

const MessageBubble = styled.div`
  max-width: 18rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${(props) =>
    props.isCurrentUser
      ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
      : "white"};
  color: ${(props) => (props.isCurrentUser ? "white" : "#1f2937")};
  box-shadow: ${(props) =>
    props.isCurrentUser ? "none" : "0 2px 10px rgba(0, 0, 0, 0.1)"};
`;

const MessageText = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const MessageTime = styled.p`
  font-size: 0.75rem;
  color: ${(props) =>
    props.isCurrentUser ? "rgba(219, 234, 254, 0.8)" : "#9ca3af"};
  margin-top: 0.25rem;
`;

const MessageInput = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 28rem;
  margin: 0 auto;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// Components
const HomePage = ({ users, onNavigate }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);

  const handleCardAction = (action) => {
    if (currentCardIndex < users.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (Math.abs(dragOffset.x) > 100) {
      handleCardAction(dragOffset.x > 0 ? "like" : "dislike");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const getCardTransform = (index) => {
    const offset = index - currentCardIndex;
    if (offset < 0) return "translateX(-100%) scale(0.8)";
    if (offset > 2) return "translateX(100%) scale(0.8)";

    const baseTransform = `translateY(${offset * 8}px) scale(${
      1 - offset * 0.05
    }) translateZ(${-offset * 10}px)`;

    if (offset === 0 && isDragging) {
      const rotation = dragOffset.x * 0.1;
      return `${baseTransform} translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`;
    }

    return baseTransform;
  };

  return (
    <HomeContainer>
      <Header>
        <Title>Sparkle</Title>
        <Subtitle>Find your perfect match</Subtitle>
      </Header>

      <CardsContainer
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {users.map((user, index) => (
          <Card
            key={user._id}
            draggable={index === currentCardIndex}
            transform={getCardTransform(index)}
            zIndex={users.length - Math.abs(index - currentCardIndex)}
            isDragging={isDragging && index === currentCardIndex}
            onMouseDown={
              index === currentCardIndex ? handleMouseDown : undefined
            }
          >
            <CardContent>
              <CardImage>
                <AvatarPlaceholder>
                  <User size={64} color="white" />
                </AvatarPlaceholder>
                <CardOverlay>
                  <CardName>{user.name}</CardName>
                  <CardAge>Age {user.age || 25}</CardAge>
                </CardOverlay>
              </CardImage>

              <CardBody>
                <LocationContainer>
                  <MapPin size={16} />
                  <LocationText>{user.location}</LocationText>
                </LocationContainer>
                <Bio>{user.bio}</Bio>
              </CardBody>
            </CardContent>
          </Card>
        ))}
      </CardsContainer>

      <ActionButtons>
        <ActionButton
          onClick={() => handleCardAction("dislike")}
          borderColor="#fecaca"
        >
          <X size={24} color="#ef4444" />
        </ActionButton>
        <ActionButton
          onClick={() => handleCardAction("like")}
          borderColor="#fce7f3"
        >
          <Heart size={24} color="#ec4899" />
        </ActionButton>
      </ActionButtons>

      <BottomNav>
        <NavContainer>
          <NavButtons>
            <NavButton active={true}>
              <Heart size={20} />
            </NavButton>
            <NavButton onClick={() => onNavigate("conversations")}>
              <MessageCircle size={20} />
            </NavButton>
          </NavButtons>
        </NavContainer>
      </BottomNav>
    </HomeContainer>
  );
};

const ConversationsPage = ({
  conversations,
  onNavigate,
  onSelectConversation,
}) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ConversationsContainer>
      <Header>
        <Title style={{ fontSize: "1.5rem" }}>Messages</Title>
      </Header>

      <ConversationsList>
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants[0];
          return (
            <ConversationItem
              key={conversation._id}
              onClick={() => {
                onSelectConversation(conversation);
                onNavigate("chat");
              }}
            >
              <ConversationContent>
                <ConversationAvatar>
                  <User size={24} color="white" />
                </ConversationAvatar>
                <ConversationDetails>
                  <ConversationName>{otherParticipant.name}</ConversationName>
                  <ConversationMessage>
                    {conversation.lastMessage.content}
                  </ConversationMessage>
                </ConversationDetails>
                <ConversationTime>
                  {formatTime(conversation.lastMessage.createdAt)}
                </ConversationTime>
              </ConversationContent>
            </ConversationItem>
          );
        })}
      </ConversationsList>

      <BottomNav>
        <NavContainer>
          <NavButtons>
            <NavButton onClick={() => onNavigate("home")}>
              <Heart size={20} />
            </NavButton>
            <NavButton active={true}>
              <MessageCircle size={20} />
            </NavButton>
          </NavButtons>
        </NavContainer>
      </BottomNav>
    </ConversationsContainer>
  );
};

const SingleConversationPage = ({ conversation, onNavigate }) => {
  const [newMessage, setNewMessage] = useState("");
  const otherParticipant = conversation.participants[0];
  const currentUserId = "684d1dd2cbbefae93e90f7d0";

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message here
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatHeaderContent>
          <BackButton onClick={() => onNavigate("conversations")}>
            <ArrowLeft size={20} color="#6b7280" />
          </BackButton>
          <ChatAvatar>
            <User size={20} color="white" />
          </ChatAvatar>
          <ChatUserInfo>
            <ChatUserName>{otherParticipant.name}</ChatUserName>
            <ChatUserStatus>Online</ChatUserStatus>
          </ChatUserInfo>
        </ChatHeaderContent>
      </ChatHeader>

      <MessagesContainer>
        {conversation.messages.map((message) => {
          const isCurrentUser = message.sender._id === currentUserId;
          return (
            <MessageWrapper key={message._id} isCurrentUser={isCurrentUser}>
              <MessageBubble isCurrentUser={isCurrentUser}>
                <MessageText>{message.content}</MessageText>
                <MessageTime isCurrentUser={isCurrentUser}>
                  {formatTime(message.createdAt)}
                </MessageTime>
              </MessageBubble>
            </MessageWrapper>
          );
        })}
      </MessagesContainer>

      <MessageInput>
        <InputContainer>
          <TextInput
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <SendButton onClick={handleSendMessage}>
            <Send size={20} />
          </SendButton>
        </InputContainer>
      </MessageInput>
    </ChatContainer>
  );
};

// Main App Component
const DatingApp = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Sample data - replace with your API calls
  const users = [
    {
      _id: "684d1dd2cbbefae93e90f7d0",
      name: "Abolaji Al Ameen",
      email: "abolaji@god.com",
      gender: "male",
      photos: [],
      bio: "Love traveling, tech, and deep conversations.",
      location: "Lagos, Nigeria",
      age: 28,
    },
    {
      _id: "684d1e1e27a28435591ff245",
      name: "Amina Yusuf",
      email: "amina.yusuf@example.com",
      gender: "female",
      photos: [],
      bio: "Creative soul, coffee lover, adventure seeker. Let's explore the world together!",
      location: "Abuja, Nigeria",
      age: 25,
    },
  ];

  const conversations = [
    {
      _id: "684d205586836152f47756a6",
      participants: [
        {
          _id: "684d1e1e27a28435591ff245",
          name: "Amina Yusuf",
          email: "amina.yusuf@example.com",
        },
        {
          _id: "684d1dd2cbbefae93e90f7d0",
          name: "Abolaji Al Ameen",
          email: "abolaji@god.com",
        },
      ],
      lastMessage: {
        content: "Hey Dev, just checking in!",
        createdAt: "2025-06-14T07:25:08.718Z",
      },
    },
  ];

  const singleConversation = {
    _id: "684d205586836152f47756a6",
    participants: [
      {
        _id: "684d1e1e27a28435591ff245",
        name: "Amina Yusuf",
        email: "amina.yusuf@example.com",
      },
      {
        _id: "684d1dd2cbbefae93e90f7d0",
        name: "Abolaji Al Ameen",
        email: "abolaji@god.com",
      },
    ],
    messages: [
      {
        _id: "684d23d4ce941e18c9f0a7db",
        sender: {
          _id: "684d1e1e27a28435591ff245",
          name: "Amina Yusuf",
        },
        content: "Hey Dev, just checking in!",
        createdAt: "2025-06-14T07:25:08.718Z",
      },
      {
        _id: "684d23d4ce941e18c9f0a7dc",
        sender: {
          _id: "684d1dd2cbbefae93e90f7d0",
          name: "Abolaji Al Ameen",
        },
        content: "Hey! Thanks for reaching out. How's your day going?",
        createdAt: "2025-06-14T07:26:15.890Z",
      },
    ],
  };

  return (
    <AppContainer>
      {currentPage === "home" && (
        <HomePage users={users} onNavigate={setCurrentPage} />
      )}
      {currentPage === "conversations" && (
        <ConversationsPage
          conversations={conversations}
          onNavigate={setCurrentPage}
          onSelectConversation={setSelectedConversation}
        />
      )}
      {currentPage === "chat" && selectedConversation && (
        <SingleConversationPage
          conversation={singleConversation}
          onNavigate={setCurrentPage}
        />
      )}
    </AppContainer>
  );
};

export default DatingApp;
