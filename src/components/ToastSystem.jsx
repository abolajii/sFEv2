import React, { useState, useEffect, createContext, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Heart, X, Users, Star } from "lucide-react";

// Toast animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Toast Container - Fixed positioning
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

// Individual Toast
const Toast = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  min-height: 70px;

  animation: ${(props) => (props.isExiting ? slideOutRight : slideInRight)} 0.3s
    ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => {
      switch (props.type) {
        case "like":
          return "linear-gradient(135deg, #ff6b6b, #ee5a24)";
        case "match":
          return "linear-gradient(135deg, #00ff88, #00cc6a)";
        case "favorite":
          return "linear-gradient(135deg, #feca57, #ff6348)";
        default:
          return "linear-gradient(135deg, #667eea, #764ba2)";
      }
    }};
  }
`;

// Progress bar for auto-dismiss
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${(props) => {
    switch (props.type) {
      case "like":
        return "linear-gradient(135deg, #ff6b6b, #ee5a24)";
      case "match":
        return "linear-gradient(135deg, #00ff88, #00cc6a)";
      case "favorite":
        return "linear-gradient(135deg, #feca57, #ff6348)";
      default:
        return "linear-gradient(135deg, #667eea, #764ba2)";
    }
  }};
  animation: ${progressBar} ${(props) => props.duration || 5000}ms linear;
  opacity: 0.6;
`;

// Icon container with animated background
const IconContainer = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) => {
    switch (props.type) {
      case "like":
        return "linear-gradient(135deg, #ff6b6b, #ee5a24)";
      case "match":
        return "linear-gradient(135deg, #00ff88, #00cc6a)";
      case "favorite":
        return "linear-gradient(135deg, #feca57, #ff6348)";
      default:
        return "linear-gradient(135deg, #667eea, #764ba2)";
    }
  }};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

// Toast content
const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToastTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #5a6c7d;
  line-height: 1.3;
`;

// Close button
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 24px;
  height: 24px;

  &:hover {
    background: rgba(149, 165, 166, 0.1);
    color: #7f8c8d;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
      isExiting: false,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  const showLikeToast = (name) => {
    addToast({
      type: "like",
      title: "💕 Someone likes you!",
      message: `${name} has liked your profile`,
      duration: 5000,
    });
  };

  const showMatchToast = (name) => {
    addToast({
      type: "match",
      title: "🎉 It's a match!",
      message: `You and ${name} liked each other`,
      duration: 7000,
    });
  };

  const showFavoriteToast = (name) => {
    addToast({
      type: "favorite",
      title: "⭐ New favorite!",
      message: `${name} added you to favorites`,
      duration: 5000,
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={20} />;
      case "match":
        return <Users size={20} />;
      case "favorite":
        return <Star size={20} />;
      default:
        return <Heart size={20} />;
    }
  };

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    showLikeToast,
    showMatchToast,
    showFavoriteToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} isExiting={toast.isExiting}>
            <IconContainer type={toast.type}>
              {getIcon(toast.type)}
            </IconContainer>

            <ToastContent>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>

            <CloseButton onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </CloseButton>

            {toast.duration !== 0 && (
              <ProgressBar type={toast.type} duration={toast.duration} />
            )}
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Usage example component
export const ToastExample = () => {
  const { showLikeToast, showMatchToast, showFavoriteToast } = useToast();

  return (
    <div style={{ padding: "20px", display: "flex", gap: "10px" }}>
      <button onClick={() => showLikeToast("Sarah")}>Show Like Toast</button>
      <button onClick={() => showMatchToast("John")}>Show Match Toast</button>
      <button onClick={() => showFavoriteToast("Emma")}>
        Show Favorite Toast
      </button>
    </div>
  );
};
