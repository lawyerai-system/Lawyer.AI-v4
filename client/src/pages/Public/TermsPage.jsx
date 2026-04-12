import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FileText, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
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
        margin-bottom: 1rem;
        line-height: 1.6;
    }
  }

  @media (max-width: 768px) {
    padding: 2.5rem;
  }
`;

const TermsPage = () => {
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
          <div style={{ color: '#6c5dd3', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Policy</div>
          <h1>Terms of Service</h1>
          <div className="meta">
            <div><Clock size={16} /> Last updated: Oct 2024</div>
            <div><FileText size={16} /> Version 2.1</div>
          </div>
        </Header>

        <Article>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Lawyer.AI, you agree to be bound by these Terms of Service. If you do not agree
            with any part of these terms, you must not use our software.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Lawyer.AI provides an AI-powered legal interface designed for informational, educational, and
            administrative legal tasks. IMPORTANT: Lawyer.AI is not a law firm and does not provide formal legal
            advice or legal representation.
          </p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>You must be of legal age to enter into a binding contract.</li>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
            <li>You acknowledge that AI-generated outputs should be verified by a qualified legal professional.</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            The software, including its AI models, algorithms, UI design, and branding, is the exclusive
            property of Lawyer.AI. You are granted a limited, personal, non-transferable license to use the platform.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Lawyer.AI shall not be liable for any direct, indirect,
            incidental, or consequential damages resulting from the use or inability to use our services.
          </p>
        </Article>
      </Container>
      <LandingFooter />
    </PageWrapper>
  );
};

export default TermsPage;

