import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Star,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../components/ToastSystem";
import { LBAuth, socketUrl } from "../api";
import { useAuth } from "../App";
import io from "socket.io-client";
// Animations
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const heartBeat = keyframes`
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
`;

// Styled Components
const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  color: #ffffff;
  /* max-width: 700px; */
  /* margin: 0 auto; */
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;

  h1 {
    color: #ffffff;
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 12px 0;
    background: linear-gradient(135deg, #1d9bf0, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  p {
    color: #71767b;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
  }
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 16px;
  }
`;

const UserCard = styled.div`
  background: #16181c;
  border: 1px solid #2f3336;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: ${slideInUp} 0.6s ease-out;
  animation-fill-mode: both;
  animation-delay: ${(props) => props.index * 0.1}s;

  &:hover {
    transform: translateY(-4px);
    background: #1a1d23;
    border-color: #3d4147;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #1d9bf0, #8b5cf6, #f91880);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const UserCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d9bf0, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: #00ba7c;
  border-radius: 50%;
  border: 3px solid #16181c;
  animation: ${pulse} 2s ease-in-out infinite;
  z-index: 2;
`;

const OfflineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  background: #536471;
  border-radius: 50%;
  border: 3px solid #16181c;
  z-index: 2;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  line-height: 1.3;

  @media (max-width: 640px) {
    font-size: 1.2rem;
  }
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  color: #71767b;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;

  svg {
    margin-right: 6px;
    color: #1d9bf0;
    flex-shrink: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-around;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(props) => props.bgColor || "#0f1419"};
  color: ${(props) => props.color || "#71767b"};
  position: relative;

  &:hover {
    transform: scale(1.1);
    background: ${(props) => props.hoverBg};
    color: #ffffff;
    border-color: ${(props) => props.hoverBorder};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const LikeButton = styled(ActionButton)`
  background: rgba(0, 186, 124, 0.1);
  color: #00ba7c;
  border-color: rgba(0, 186, 124, 0.2);

  &:hover {
    background: #00ba7c;
    border-color: #00ba7c;

    svg {
      animation: ${heartBeat} 0.8s ease-in-out;
    }
  }
`;

const DislikeButton = styled(ActionButton)`
  background: rgba(244, 33, 46, 0.1);
  color: #f4212e;
  border-color: rgba(244, 33, 46, 0.2);

  &:hover {
    background: #f4212e;
    border-color: #f4212e;
  }
`;

const FavoriteButton = styled(ActionButton)`
  background: rgba(255, 212, 0, 0.1);
  color: #ffd400;
  border-color: rgba(255, 212, 0, 0.2);

  &:hover {
    background: #ffd400;
    border-color: #ffd400;
    color: #000000;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  animation: ${slideInUp} 0.6s ease-out;

  .icon-container {
    width: 96px;
    height: 96px;
    margin: 0 auto 24px;
    border-radius: 50%;
    background: rgba(29, 155, 240, 0.1);
    border: 2px solid rgba(29, 155, 240, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 12px 0;
    line-height: 1.3;
  }

  p {
    color: #71767b;
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  animation: ${slideInUp} 0.6s ease-out;

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(29, 155, 240, 0.2);
    border-top: 3px solid #1d9bf0;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: #71767b;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 500;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 24px;
  background: rgba(244, 33, 46, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(244, 33, 46, 0.2);
  margin: 20px auto;
  max-width: 500px;
  animation: ${slideInUp} 0.6s ease-out;

  .error-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: rgba(244, 33, 46, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    color: #f4212e;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 12px 0;
    line-height: 1.3;
  }

  p {
    color: #71767b;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  button {
    background: #f4212e;
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 24px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: #dc1a2e;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 33, 46, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

// Mock toast system
// const useToast = () => ({
//   showLikeToast: (name) => console.log(`${name} liked you!`),
//   showMatchToast: (name) => console.log(`You matched with ${name}!`),
//   showFavoriteToast: (name) => console.log(`${name} favorited you!`),
// });

const socket = io(socketUrl, {
  auth: { token: JSON.parse(localStorage.getItem("token"))?.accessToken },
});

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showLikeToast, showMatchToast, showFavoriteToast } = useToast();

  const { currentUser, logout } = useAuth();

  //   useEffect(() => {
  //     // Simulate loading
  //     setTimeout(() => {
  //       setUsers(mockUsers);
  //       setLoading(false);
  //     }, 1500);
  //   }, []);

  // const fetchAllUsers = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     setUsers(mockUsers);
  //   } catch (err) {
  //     console.error("Error fetching users:", err);
  //     setError("Failed to load users. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("userOnline", currentUser._id);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();

    // Listen for user online events
    socket.on("userOnline", ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "online" } : user
        )
      );
    });

    // Listen for user offline events
    socket.on("userOffline", ({ userId }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "offline" } : user
        )
      );
    });

    // Cleanup socket listeners
    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);

  useEffect(() => {
    socket.on("likedYou", ({ fromUserId, name }) => {
      console.log(`You were liked by a user with ID: ${fromUserId}`);
      showLikeToast(name);
    });

    return () => {
      socket.off("likedYou");
    };
  }, [showLikeToast]);

  useEffect(() => {
    socket.on("matchFound", ({ user, convo, name }) => {
      console.log(`Match found with user: ${user.name}`);
      showMatchToast(name || user.name);
    });

    return () => {
      socket.off("matchFound");
    };
  }, [showMatchToast]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await LBAuth.get(`/users`);
      setUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (userId, userName) => {
    console.log(`Liked user: ${userName}`);
    showLikeToast(userName);
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleDislike = (userId, userName) => {
    console.log(`Disliked user: ${userName}`);
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleFavorite = (userId, userName) => {
    console.log(`Favorited user: ${userName}`);
    showFavoriteToast(userName);
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  return (
    <Container>
      <Header>
        <h1>Discover People</h1>
        <p>Find your perfect match from amazing people around you</p>
      </Header>

      <UsersList>
        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading amazing people...</p>
          </LoadingSpinner>
        ) : error ? (
          <ErrorMessage>
            <div className="error-icon">
              <AlertCircle size={32} color="#f4212e" />
            </div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchAllUsers}>
              <RefreshCw size={16} />
              Try Again
            </button>
          </ErrorMessage>
        ) : users.length === 0 ? (
          <EmptyState>
            <div className="icon-container">
              <Heart size={48} color="#1d9bf0" />
            </div>
            <h3>No users found</h3>
            <p>Check back later for new connections!</p>
          </EmptyState>
        ) : (
          users.map((user, index) => (
            <UserCard key={user._id} index={index}>
              <UserCardContent>
                <UserInfo>
                  <AvatarContainer>
                    <Avatar>{user.avatar}</Avatar>
                    {user.status === "online" ? (
                      <OnlineIndicator />
                    ) : (
                      <OfflineIndicator />
                    )}
                  </AvatarContainer>
                  <UserDetails>
                    <UserName>{user.name}</UserName>
                    <LocationRow>
                      <MapPin size={16} />
                      {user.location}
                    </LocationRow>
                  </UserDetails>
                </UserInfo>

                <ButtonContainer>
                  <LikeButton
                    onClick={() => handleLike(user._id, user.name)}
                    title="Like"
                  >
                    <ThumbsUp size={18} />
                  </LikeButton>

                  <DislikeButton
                    onClick={() => handleDislike(user._id, user.name)}
                    title="Pass"
                  >
                    <ThumbsDown size={18} />
                  </DislikeButton>

                  <FavoriteButton
                    onClick={() => handleFavorite(user._id, user.name)}
                    title="Super Like"
                  >
                    <Star size={18} />
                  </FavoriteButton>
                </ButtonContainer>
              </UserCardContent>
            </UserCard>
          ))
        )}
      </UsersList>
    </Container>
  );
};

export default Home;
