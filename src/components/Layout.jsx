import { useState } from "react";
import styled from "styled-components";
import {
  Home,
  MessageCircle,
  Heart,
  User,
  Menu,
  X,
  Bell,
  Settings,
} from "lucide-react";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 24px;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 40;

  @media (max-width: 768px) {
    transform: ${(props) =>
      props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease-in-out;
  }

  @media (min-width: 769px) {
    position: static;
    transform: none;
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  display: ${(props) => (props.isOpen ? "block" : "none")};

  @media (min-width: 769px) {
    display: none;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const LogoText = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  position: relative;

  ${(props) =>
    props.isActive
      ? `
    background: linear-gradient(135deg, #ec4899, #f43f5e);
    color: white;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
  `
      : `
    background: none;
    color: #6b7280;
    
    &:hover {
      background-color: #f9fafb;
      color: #111827;
    }
  `}
`;

const Badge = styled.span`
  margin-left: auto;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 600;

  ${(props) =>
    props.isActive
      ? `
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  `
      : `
    background-color: #fce7f3;
    color: #ec4899;
  `}
`;

const MainContent = styled.main`
  flex: 1;
  /* margin-left: 0; */

  @media (min-width: 769px) {
    /* margin-left: 280px; */
  }
`;

const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 769px) {
    padding: 16px 32px;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
`;

const ContentArea = styled.div`
  @media (min-width: 769px) {
    padding: 32px;
  }
`;

const DashboardLayout = ({ children, activeTab = "dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "chats", label: "Chats", icon: MessageCircle, badge: 3 },
    { id: "match", label: "Matches", icon: Heart, badge: 5 },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleMenuClick = (menuId) => {
    console.log(`Navigating to: ${menuId}`);
    setSidebarOpen(false);
  };

  return (
    <Container>
      {/* Sidebar Overlay */}
      <SidebarOverlay
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        <Header>
          <Logo>
            <LogoIcon>💕</LogoIcon>
            <LogoText>LoveApp</LogoText>
          </Logo>
          <CloseButton onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <MenuItem
                key={item.id}
                isActive={isActive}
                onClick={() => handleMenuClick(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.badge && <Badge isActive={isActive}>{item.badge}</Badge>}
              </MenuItem>
            );
          })}
        </Nav>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Top Bar */}
        <TopBar>
          <MobileMenuButton onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </MobileMenuButton>

          <TopBarActions>
            <ActionButton>
              <Bell size={20} />
              <NotificationDot />
            </ActionButton>
            <ActionButton>
              <Settings size={20} />
            </ActionButton>
          </TopBarActions>
        </TopBar>

        {/* Content Area */}
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </Container>
  );
};

export default DashboardLayout;
