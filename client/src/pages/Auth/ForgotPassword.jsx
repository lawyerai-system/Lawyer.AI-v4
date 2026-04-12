import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import LogoPanel from '../../components/Branding/LogoPanel';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: var(--bg-dark);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-dark);
  padding: 2rem;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;

  &:hover {
    color: white;
    transform: translateX(-5px);
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  background: var(--bg-panel);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const InputGroup = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      if (response.data.status === 'success') {
        toast.success('Reset link sent to your email!');
        setEmail('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LogoPanel />
      <FormSection>
        <BackButton to="/auth">
          <FaArrowLeft size={14} /> Back to Login
        </BackButton>
        <FormCard>
          <Title>Forgot Password?</Title>
          <Subtitle>
            Enter your email address and we'll send you a link to reset your password.
          </Subtitle>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon><FaEnvelope /></InputIcon>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </SubmitButton>
          </form>
        </FormCard>
      </FormSection>
    </PageContainer>
  );
};

export default ForgotPassword;
