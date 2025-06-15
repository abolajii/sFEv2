import styled from "styled-components";
import {
  FormGroup,
  Label,
  LoginCard,
  LoginContainer,
  LoginSubtitle,
  LoginTitle,
  PasswordContainer,
  PasswordToggle,
} from "./Login";

import { Input, PageContainer, PrimaryButton } from "../../shared";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const LoginLink = styled.a`
  color: #ec4899;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterContainer = styled(LoginContainer)`
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 50%, #dbeafe 100%);
`;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  const navigate = useNavigate();

  return (
    <RegisterContainer>
      <LoginCard>
        <LoginTitle>Join Sparkle</LoginTitle>
        <LoginSubtitle>Create your account to start matching</LoginSubtitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordContainer>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordContainer>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordContainer>
          </FormGroup>

          <PrimaryButton type="submit" style={{ width: "100%" }}>
            Create Account
          </PrimaryButton>
        </form>

        <LoginFooter>
          Already have an account?{" "}
          <LoginLink onClick={() => navigate("/")}>Sign in</LoginLink>
        </LoginFooter>
      </LoginCard>
    </RegisterContainer>
  );
};
export default Register;
