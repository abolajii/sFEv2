import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Heart, ThumbsUp, ThumbsDown, Star, MapPin } from "lucide-react";
import { baseUrl, getToken, LBAuth, socketUrl } from "../api";
import { useAuth } from "../App";
import io from "socket.io-client";
import { useToast } from "../components/ToastSystem";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const WelcomeMessage = styled.div`
  h2 {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #ff6b6b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    margin: 0;
  }
`;

const UsersList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  }
`;

const UserCardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
`;

// Pulsing animation for the online indicator
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

const Online = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 255, 136, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    opacity: 0.9;
  }
`;

const Offline = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #95a5a6;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(149, 165, 166, 0.4);
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    opacity: 0.9;
  }
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: relative; /* Added for online indicator positioning */
`;

const UserDetails = styled.div`
  flex: 1;
`;

const CardUserName = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  color: #5a6c7d;
  font-size: 0.95rem;

  svg {
    margin-right: 8px;
    color: #667eea;
    flex-shrink: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => props.bgColor || "#f8f9fa"};
  color: ${(props) => props.textColor || "#5a6c7d"};

  &:hover {
    transform: translateY(-3px) scale(1.1);
    background: ${(props) => props.hoverColor};
    color: white;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px) scale(1.05);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;

  .icon-container {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin: 0 0 10px 0;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
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

  p {
    margin-left: 20px;
    color: white;
    font-size: 1.1rem;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(231, 76, 60, 0.3);
  margin: 20px auto;
  max-width: 500px;

  h3 {
    color: #e74c3c;
    font-size: 1.5rem;
    margin: 0 0 10px 0;
  }

  p {
    color: rgba(231, 76, 60, 0.8);
    margin: 0 0 20px 0;
  }

  button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: #c0392b;
      transform: translateY(-2px);
    }
  }
`;

const socket = io(socketUrl, {
  auth: { token: JSON.parse(localStorage.getItem("token"))?.accessToken },
});

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, logout } = useAuth();

  const { showLikeToast, showMatchToast, showFavoriteToast } = useToast();

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

    // Listen for liked notifications
    // socket.on("likedYou", ({ fromUserId }) => {
    //   console.log(`You were liked by a user with ID: ${fromUserId}`);
    //   // You can fetch user details or show a toast/notification here
    // });

    // Cleanup socket listeners
    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
      // socket.off("likedYou");
    };
  }, []);

  // useEffect(() => {
  //   socket.on("likedYou", ({ fromUserId, name }) => {
  //     console.log(`You were liked by a user with ID: ${fromUserId}`);
  //     // You can fetch user details or show a toast/notification here
  //     showLikeToast(name);
  //   });

  //   return () => {
  //     socket.off("likedYou");
  //   };
  // }, []);

  // useEffect(() => {
  //   socket.on("matchFound", ({ user, convo, name }) => {
  //     console.log(`Match found with user: ${user.name}`);
  //     // You can show a notification or redirect to a chat page here
  //     showMatchToast(user.name);
  //   });
  //   return () => {
  //     socket.off("matchFound");
  //   };
  // }, []);

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

  const like = (id) => {
    socket.emit("likeUser", { toUserId: id });
  };

  const handleLike = (userId) => {
    like(userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleDislike = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleFavorite = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleLogout = () => {
    // Emit user offline before logout
    if (currentUser?._id) {
      socket.emit("userOffline", currentUser._id);
    }
    console.log("Logging out...");
    logout();
  };

  return (
    <Container>
      <TopNav>
        <WelcomeMessage>
          <h2>Welcome back, {currentUser?.name}!</h2>
        </WelcomeMessage>

        <UserSection>
          <UserInfo>
            <UserName>{currentUser?.name}</UserName>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserSection>
      </TopNav>

      <UsersList>
        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading users...</p>
          </LoadingSpinner>
        ) : error ? (
          <ErrorMessage>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchAllUsers}>Try Again</button>
          </ErrorMessage>
        ) : users.length === 0 ? (
          <EmptyState>
            <div className="icon-container">
              <Heart size={40} color="white" />
            </div>
            <h3>No users found</h3>
            <p>Check back later for new connections!</p>
          </EmptyState>
        ) : (
          users.map((user) => (
            <UserCard key={user._id}>
              <UserCardInfo>
                <Avatar>
                  {user.avatar}
                  {user.status === "online" ? <Online /> : <Offline />}
                </Avatar>
                <UserDetails>
                  <CardUserName>{user.name}</CardUserName>
                  <LocationRow>
                    <MapPin size={16} />
                    {user.location}
                  </LocationRow>
                </UserDetails>
              </UserCardInfo>

              <ButtonContainer>
                <ActionButton
                  onClick={() => handleLike(user._id)}
                  bgColor="#e8f5e8"
                  textColor="#27ae60"
                  hoverColor="#27ae60"
                  title="Like & Remove"
                >
                  <ThumbsUp size={18} />
                </ActionButton>

                <ActionButton
                  onClick={() => handleDislike(user._id)}
                  bgColor="#fdeaea"
                  textColor="#e74c3c"
                  hoverColor="#e74c3c"
                  title="Dislike & Remove"
                >
                  <ThumbsDown size={18} />
                </ActionButton>

                <ActionButton
                  onClick={() => handleFavorite(user._id)}
                  bgColor="#fff8e1"
                  textColor="#f39c12"
                  hoverColor="#f39c12"
                  title="Favorite & Remove"
                >
                  <Star size={18} />
                </ActionButton>
              </ButtonContainer>
            </UserCard>
          ))
        )}
      </UsersList>
    </Container>
  );
};

export default Home;
