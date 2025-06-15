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

// Mock Router Link component for demonstration
const RouterLink = ({ to, children, ...props }) => (
  <a
    href={to}
    {...props}
    onClick={(e) => {
      e.preventDefault();
      console.log(`Navigating to: ${to}`);
      if (props.onClick) props.onClick();
    }}
  >
    {children}
  </a>
);

// Styled Components with Twitter-like dark theme
const Container = styled.div`
  min-height: 100vh;
  background-color: #000000;
  display: flex;
  color: #ffffff;
`;

const Sidebar = styled.aside`
  width: 275px;
  background-color: #000000;
  border-right: 1px solid #2f3336;
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
  background-color: rgba(0, 0, 0, 0.75);
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
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1d9bf0, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const LogoText = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #71767b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #1d1f23;
    color: #ffffff;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuLink = styled(RouterLink)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 24px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 20px;
  position: relative;

  ${(props) =>
    props.isActive
      ? `
    background-color: #1d1f23;
    color: #1d9bf0;
    
    &:hover {
      background-color: #1d1f23;
    }
  `
      : `
    background: none;
    color: #ffffff;
    
    &:hover {
      background-color: #080808;
    }
  `}
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
`;

const MenuText = styled.span`
  font-size: 20px;
  font-weight: 400;
`;

const Badge = styled.span`
  margin-left: auto;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 12px;
  font-weight: 600;
  background-color: #1d9bf0;
  color: white;
  min-width: 20px;
  text-align: center;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #000000;

  @media (min-width: 769px) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #2f3336;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 20;

  @media (min-width: 769px) {
    padding: 16px 32px;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #71767b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #1d1f23;
    color: #ffffff;
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
  color: #71767b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #1d1f23;
    color: #ffffff;
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #1d9bf0;
  border-radius: 50%;
  border: 2px solid #000000;
`;

const ContentArea = styled.div`
  padding: 24px;
  min-height: calc(100vh - 73px);

  @media (min-width: 769px) {
    padding: 32px;
  }
`;

const DashboardLayout = ({ children, activeTab = "dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
    {
      id: "messages",
      label: "Conversations",
      icon: MessageCircle,
      badge: 3,
      path: "/conversations",
    },
    {
      id: "matches",
      label: "Matches",
      icon: Heart,
      badge: 5,
      path: "/matches",
    },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleMenuClick = () => {
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
              <MenuLink
                key={item.id}
                to={item.path}
                isActive={isActive}
                onClick={handleMenuClick}
              >
                <MenuIcon>
                  <Icon size={26} />
                </MenuIcon>
                <MenuText>{item.label}</MenuText>
                {item.badge && <Badge>{item.badge}</Badge>}
              </MenuLink>
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
