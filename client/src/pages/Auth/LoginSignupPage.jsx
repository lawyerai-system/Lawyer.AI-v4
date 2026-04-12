import React, { useState } from 'react';
import styled from 'styled-components';
import LogoPanel from '../../components/Branding/LogoPanel';
import LoginForm from '../../components/Auth/LoginForm';
import SignupForm from '../../components/Auth/SignupForm';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

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
  justify-content: flex-start; /* Start from top to prevent clipping */
  align-items: center;
  background-color: var(--bg-dark);
  padding: 2rem;
  position: relative;
  overflow-y: auto;
  max-height: 100vh;

  @media (max-width: 768px) {
    overflow-y: visible; /* Disable internal scroll on mobile */
    max-height: none;    /* Allow full height expansion */
    padding: 1rem;
    flex: none;          /* Let content dictate height */
  }
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
  z-index: 10;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    position: relative;
    align-self: flex-start;
    margin-bottom: 1rem;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  background: var(--bg-panel);
  margin: auto; /* Center vertically when space permits */
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
    background: transparent;
    box-shadow: none;
    border: none;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const ToggleBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.6rem;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary);
    transform: scaleX(${props => props.$active ? 1 : 0});
    transform-origin: left;
    transition: transform 0.3s;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: white;
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;


const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        photo: user.photoURL
      };

      setError(null);
      const loginResult = await googleLogin(userInfo);
      if (loginResult.success) {
        navigate('/login-redirect');
      } else {
        setError(loginResult.message);
      }

    } catch (error) {
      console.error("Google Login Error:", error);
      setError("Google Login Failed: " + error.message);
    }
  };

  return (
    <PageContainer>
      <LogoPanel />
      <FormSection>
        <BackButton to="/">
          <FaArrowLeft size={14} /> Back to Home
        </BackButton>
        <FormCard>
          <ToggleContainer>
            <ToggleBtn $active={isLogin} onClick={() => { setIsLogin(true); setError(null); }}>Login</ToggleBtn>
            <ToggleBtn $active={!isLogin} onClick={() => { setIsLogin(false); setError(null); }}>Sign Up</ToggleBtn>
          </ToggleContainer>

          {error && (
            <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.9rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {isLogin ? (
            <>
              <h2 style={{ margin: '0 0 1rem 0' }}>Welcome Back!</h2>
              <LoginForm />
            </>
          ) : (
            <>
              <h2 style={{ margin: '0 0 1rem 0' }}>Join Lawyer.AI</h2>
              <SignupForm switchToLogin={() => setIsLogin(true)} />
            </>
          )}

          {isLogin && (
            <>
              <Divider>Or continue with</Divider>

              <GoogleButton onClick={handleGoogleLogin}>
                {/* <FcGoogle size={24} /> */}
                Google
              </GoogleButton>
            </>
          )}
        </FormCard>
      </FormSection>
    </PageContainer>
  );
};

export default LoginSignupPage;
