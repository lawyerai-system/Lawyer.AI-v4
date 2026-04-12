import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Clock, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import { useAuth } from '../../context/AuthContext';

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 10rem 2rem 8rem;
`;

const BackToHome = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c5dd3;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 2rem;
    transition: all 0.3s;
    width: fit-content;

    &:hover {
        gap: 0.8rem;
        opacity: 0.8;
    }
`;

const Header = styled.div`
  margin-bottom: 5rem;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: #a0a3bd;
    font-size: 0.95rem;
    
    div { display: flex; align-items: center; gap: 0.5rem; }
  }
`;

const Article = styled.article`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4rem;
  border-radius: 32px;
  backdrop-filter: blur(20px);

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 3rem 0 1.5rem;
    color: white;
    
    &:first-child { margin-top: 0; }
  }

  p {
    font-size: 1.1rem;
    color: #a0a3bd;
    line-height: 1.8;
    margin-bottom: 2rem;
  }

  ul {
      padding-left: 1.5rem;
      margin-bottom: 2rem;
      
      li {
          color: #a0a3bd;
          margin-bottom: 0.8rem;
          line-height: 1.6;
      }
  }

  @media (max-width: 768px) {
    padding: 2.5rem;
  }
`;

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHomeRedirect = () => {
    if (user) {
      navigate('/login-redirect');
    } else {
      navigate('/');
    }
  };

  return (
    <PageWrapper>
      <LandingNav />
      <Container>
        <BackToHome onClick={handleHomeRedirect}>
          <ArrowLeft size={16} /> Back to Homepage
        </BackToHome>
        <Header>
          <div style={{ color: '#6c5dd3', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Privacy Policy</div>
          <h1>Your Privacy Matters</h1>
          <div className="meta">
            <div><Clock size={16} /> Last updated: Oct 2024</div>
            <div><Lock size={16} /> Data Encryption: 100% Active</div>
          </div>
        </Header>

        <Article>
          <h2>1. Introduction</h2>
          <p>
            Lawyer.AI recognizes the sensitivity of legal data. This Privacy Policy describes how we collect, use,
            and protect your personal and legal information when you use our platform.
          </p>

          <h2>2. Information We Collect</h2>
          <ul>
            <li>Personal identifiers: Name, email address, and profile picture.</li>
            <li>Case details: Text inputs to the AI chat, courtroom simulations, and IPC searches.</li>
            <li>Technical data: IP address, browser type, and device information.</li>
          </ul>

          <h2>3. How We Use and Protect Your Data</h2>
          <p>
            We use your data solely to provide and improve the legal AI services. Your courtroom data and chat
            histories are end-to-end encrypted. We DO NOT sell your personal or case information to third-party
            marketers or data brokers.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            You have the right to delete your account and all associated data at any time through the Profile
            Settings in your dashboard. Once deleted, this information is permanently purged from our secure servers.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions regarding your privacy or data usage, please reach out to our Data
            Protection Officer at privacy@lawyer.ai.
          </p>
        </Article>
      </Container>
      <LandingFooter />
    </PageWrapper>
  );
};

export default PrivacyPage;

