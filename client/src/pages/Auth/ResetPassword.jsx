import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';
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

const EyeIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: var(--text-secondary);
  cursor: pointer;
  z-index: 5;
  
  &:hover {
    color: var(--text-main);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await api.patch(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });

      if (response.data.status === 'success') {
        toast.success('Password reset successful! You can now log in.');
        setTimeout(() => navigate('/auth'), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LogoPanel />
      <FormSection>
        <FormCard>
          <Title>Reset Password</Title>
          <Subtitle>
            Set a new password for your Lawyer.AI account.
          </Subtitle>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
            <InputGroup>
              <InputIcon><FaLock /></InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </InputGroup>

            <InputGroup>
              <InputIcon><FaLock /></InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </SubmitButton>
          </form>
        </FormCard>
      </FormSection>
    </PageContainer>
  );
};

export default ResetPassword;
