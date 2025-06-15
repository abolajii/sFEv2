import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  LogOut,
  BarChart3,
  Users,
  Settings,
  Home,
  FileText,
} from "lucide-react";
import styled from "styled-components";

// Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.25rem;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const IconWrapper = styled.div`
  background: #dbeafe;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

const AuthSwitch = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`;

const SwitchText = styled.p`
  color: #6b7280;
  margin: 0;
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;

  &:hover {
    color: #1d4ed8;
  }
`;

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  display: flex;
`;

const Sidebar = styled.nav`
  width: 250px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 0;
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 2rem 1.5rem;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) => (props.active ? "#f3f4f6" : "transparent")};
  color: ${(props) => (props.active ? "#2563eb" : "#6b7280")};
  cursor: pointer;
  font-size: 0.875rem;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #2563eb;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DashboardHeader = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DashboardTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: #374151;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const PageContent = styled.main`
  padding: 2rem;
  flex: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  background: ${(props) => props.color};
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const ContentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ContentTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const ContentText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      if (savedUser) {
        setIsAuthenticated(true);
        setCurrentUser(savedUser);
      }
      setLoading(false);
    };

    setTimeout(checkAuth, 500);
  }, []);

  const login = (email, password) => {
    const user = { id: 1, email, name: email.split("@")[0] };
    setCurrentUser(user);
    setIsAuthenticated(true);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer>
        <LoadingText>Loading...</LoadingText>
      </AppContainer>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AppContainer>
        <LoadingText>Loading...</LoadingText>
      </AppContainer>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Login Component
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password);
      navigate("/dashboard");
    } else {
      alert("Registration successful! Please login.");
      setIsLogin(true);
      setFormData({ email: "", password: "", confirmPassword: "" });
    }
  };

  return (
    <AppContainer>
      <AuthCard>
        <AuthHeader>
          <IconWrapper>
            <Lock size={32} color="#2563eb" />
          </IconWrapper>
          <Title>{isLogin ? "Welcome Back" : "Create Account"}</Title>
          <Subtitle>
            {isLogin ? "Sign in to your account" : "Sign up to get started"}
          </Subtitle>
        </AuthHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </InputWrapper>
          </FormGroup>

          {!isLogin && (
            <FormGroup>
              <Label>Confirm Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  type="password"
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </InputWrapper>
            </FormGroup>
          )}

          <Button type="submit">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </Form>

        <AuthSwitch>
          <SwitchText>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <SwitchLink onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Sign in"}
            </SwitchLink>
          </SwitchText>
        </AuthSwitch>
      </AuthCard>
    </AppContainer>
  );
};

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/dashboard/users", label: "Users", icon: Users },
    { path: "/dashboard/reports", label: "Reports", icon: FileText },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarTitle>Menu</SidebarTitle>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <Icon size={18} />
              {item.label}
            </NavItem>
          );
        })}
      </Sidebar>

      <MainContent>
        <DashboardHeader>
          <DashboardTitle>Dashboard</DashboardTitle>
          <UserInfo>
            <User size={20} color="#6b7280" />
            <UserName>Welcome, {currentUser?.name}!</UserName>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </LogoutButton>
          </UserInfo>
        </DashboardHeader>

        <PageContent>{children}</PageContent>
      </MainContent>
    </DashboardContainer>
  );
};

// Dashboard Pages
const DashboardHome = () => (
  <>
    <StatsGrid>
      <StatCard>
        <StatIcon color="#3b82f6">
          <BarChart3 size={24} />
        </StatIcon>
        <StatContent>
          <StatTitle>Total Sales</StatTitle>
          <StatValue>$24,500</StatValue>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon color="#10b981">
          <Users size={24} />
        </StatIcon>
        <StatContent>
          <StatTitle>Active Users</StatTitle>
          <StatValue>1,234</StatValue>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon color="#f59e0b">
          <Settings size={24} />
        </StatIcon>
        <StatContent>
          <StatTitle>Projects</StatTitle>
          <StatValue>12</StatValue>
        </StatContent>
      </StatCard>
    </StatsGrid>

    <ContentCard>
      <ContentTitle>Welcome to your Dashboard!</ContentTitle>
      <ContentText>
        You have successfully logged in using React Router DOM navigation. This
        dashboard includes multiple routes and pages. Use the sidebar to
        navigate between different sections. The authentication system
        automatically redirects based on your login status.
      </ContentText>
    </ContentCard>
  </>
);

const Analytics = () => (
  <ContentCard>
    <ContentTitle>Analytics</ContentTitle>
    <ContentText>
      This is the Analytics page. Here you would typically see charts, graphs,
      and data visualizations showing various metrics and performance indicators
      for your application.
    </ContentText>
  </ContentCard>
);

const UsersPage = () => (
  <ContentCard>
    <ContentTitle>Users Management</ContentTitle>
    <ContentText>
      This is the Users page where you can manage user accounts, view user
      profiles, and handle user permissions and settings.
    </ContentText>
  </ContentCard>
);

const Reports = () => (
  <ContentCard>
    <ContentTitle>Reports</ContentTitle>
    <ContentText>
      This is the Reports page where you can generate and view various reports,
      export data, and analyze trends over time.
    </ContentText>
  </ContentCard>
);

const SettingsPage = () => (
  <ContentCard>
    <ContentTitle>Settings</ContentTitle>
    <ContentText>
      This is the Settings page where you can configure application preferences,
      update your profile, and manage account settings.
    </ContentText>
  </ContentCard>
);

// Main App Component
const AuthProject = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardHome />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AuthProject;
