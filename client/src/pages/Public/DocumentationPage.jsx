import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Shield, Cpu, Terminal,
  Book, MessageSquare, Play, Code, ArrowLeft, GraduationCap
} from 'lucide-react';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import { useAuth } from '../../context/AuthContext';

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
  flex: 1;

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 4rem;
  }
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

const Hero = styled.div`
  margin-bottom: 4rem;

  h1 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;

    @media (max-width: 768px) {
      font-size: 2.2rem;
      letter-spacing: -1px;
    }
  }

  p {
    font-size: 1.2rem;
    color: #a0a3bd;
    line-height: 1.7;
    max-width: 700px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 5rem;
  
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;

    .icon-box {
        width: 40px;
        height: 40px;
        background: rgba(108, 93, 211, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6c5dd3;
    }
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 24px;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(108, 93, 211, 0.3);
    background: rgba(255, 255, 255, 0.03);
  }

  h3 {
    margin-bottom: 1rem;
    font-weight: 700;
    color: white;
  }

  p {
    font-size: 0.95rem;
    color: #a0a3bd;
    line-height: 1.6;
    margin: 0;
  }
`;

const CodeBlock = styled.div`
  background: #080a10;
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #a0a3bd;
  margin: 2rem 0;
  position: relative;
  overflow-x: auto;
  
  &::before {
    content: 'JavaScript SDK';
    position: absolute;
    top: 0;
    right: 2rem;
    transform: translateY(-50%);
    background: #6c5dd3;
    color: white;
    padding: 0.3rem 1rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;

    @media (max-width: 768px) {
        display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 0.8rem;
    border-radius: 12px;
    word-break: break-all;
  }
`;

const DocumentationPage = () => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BackToHome onClick={handleHomeRedirect}>
            <ArrowLeft size={16} /> Back to Homepage
          </BackToHome>

          <Hero>
            <h1>Documentation</h1>
            <p>
              Everything you need to know about navigating and integrating with the Lawyer.AI platform.
              From initial setup to advanced courtroom simulations.
            </p>
          </Hero>

          <Section>
            <h2>
              <div className="icon-box"><Zap size={20} /></div>
              Platform Overview
            </h2>
            <FeatureGrid>
              <FeatureCard>
                <h3>1. Authentication</h3>
                <p>Gain access by creating an account. We support standard email/password Login and Google OAuth for seamless entry.</p>
              </FeatureCard>
              <FeatureCard>
                <h3>2. Data Privacy</h3>
                <p>All your case data and chat histories are end-to-end encrypted. We prioritize your confidentiality above all else.</p>
              </FeatureCard>
              <FeatureCard>
                <h3>3. Role-Based Access</h3>
                <p>Tailored experiences for Advocates, Students, and Admin users with specific modules for each user type.</p>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <h2>
              <div className="icon-box"><Terminal size={20} /></div>
              Core Modules
            </h2>
            <FeatureGrid>
              <FeatureCard>
                <MessageSquare size={24} color="#6c5dd3" style={{ marginBottom: '1rem' }} />
                <h3>AI Legal Chat</h3>
                <p>Ask any legal question in natural language and receive context-aware advice based on Indian Penal Code precedents.</p>
              </FeatureCard>
              <FeatureCard>
                <Terminal size={24} color="#6c5dd3" style={{ marginBottom: '1rem' }} />
                <h3>IPC Code Finder</h3>
                <p>Quickly search and retrieve detailed sections from the Indian Penal Code, including punishments and legal definitions.</p>
              </FeatureCard>
              <FeatureCard>
                <Play size={24} color="#6c5dd3" style={{ marginBottom: '1rem' }} />
                <h3>Virtual Courtroom</h3>
                <p>Practice arguments and witness examinations in a fully simulated judicial environment with real-time AI feedback.</p>
              </FeatureCard>
            </FeatureGrid>
          </Section>

          <Section>
            <h2>
              <div className="icon-box"><Code size={20} /></div>
              Technical Integration
            </h2>
            <p style={{ color: '#a0a3bd', marginBottom: '1.5rem' }}>Developers can integrate Lawyer.AI intelligence directly into their legal management software using our Global SDK.</p>
            <CodeBlock>
                            // Initialize the Lawyer.AI Library <br />
              const lawAI = new LawyerAI({'{'} <br />
              &nbsp;&nbsp;apiKey: 'L_AI_PRO_7721', <br />
              &nbsp;&nbsp;region: 'india-west' <br />
              {'}'}); <br /><br />
                            // Query legal intelligence <br />
              const advice = await lawAI.getLegalAdvice("Understanding Section 302");
            </CodeBlock>
          </Section>

          <Section style={{ textAlign: 'center', background: 'rgba(108, 93, 211, 0.05)', padding: '4rem 2rem', borderRadius: '40px', border: '1px dashed rgba(108, 93, 211, 0.2)' }} className="cta-section">
            <style>{`
                @media (max-width: 768px) {
                    .cta-section { padding: 3rem 1.5rem !important; border-radius: 24px !important; }
                }
            `}</style>
            <GraduationCap size={48} color="#6c5dd3" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>Need more help?</h2>
            <p style={{ margin: '0 auto 2rem', maxWidth: '500px', fontSize: '0.95rem' }}>Join our 10,000+ legal professionals on the platform to access detailed video training and case studies.</p>
            <button
              onClick={() => navigate('/auth')}
              style={{
                background: '#6c5dd3',
                color: 'white',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              Get Started Now
            </button>
          </Section>
        </motion.div>
      </Container>
      <LandingFooter />
    </PageWrapper>
  );
};

export default DocumentationPage;
