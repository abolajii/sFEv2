import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.4);
  }
`;

export const SecondaryButton = styled(Button)`
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;
