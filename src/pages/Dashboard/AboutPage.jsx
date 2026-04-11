import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaQuoteLeft, FaRocket, FaBullseye, FaUsers, FaMicrochip, FaArrowRight, FaScaleBalanced, FaGraduationCap } from 'react-icons/fa6';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import AIModel from '../../components/Landing/AIModel';

const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
`;

const PageContainer = styled.div`
  padding: 10rem 2rem 8rem;
  animation: ${fadeIn} 0.8s ease-out;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 8rem;
  position: relative;
  
  h1 {
    font-size: 5rem;
    font-weight: 900;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -3px;

    @media (max-width: 768px) {
      font-size: 3rem;
    }
  }

  p {
    font-size: 1.4rem;
    color: #a0a3bd;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    font-weight: 300;
  }
`;

const Section = styled.section`
  margin-bottom: 10rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  
  &:nth-child(even) {
    direction: rtl;
    & > * { direction: ltr; }
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
  }
`;

const ContentBlock = styled.div`
  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    
    @media (max-width: 1024px) { justify-content: center; }
  }

  p {
    font-size: 1.15rem;
    color: #a0a3bd;
    line-height: 1.9;
    margin-bottom: 2rem;
  }

  .accent-box {
    background: rgba(108, 93, 211, 0.05);
    border-left: 4px solid var(--primary);
    padding: 2rem;
    border-radius: 0 20px 20px 0;
    margin-top: 2rem;
    
    span {
      display: block;
      color: #fff;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
  }
`;

const VisualBlock = styled.div`
  height: 500px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.5);

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%);
    opacity: 0.1;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem 2rem;
  border-radius: 32px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-10px);
    background: rgba(108, 93, 211, 0.05);
    border-color: var(--primary);
  }

  .icon {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    display: inline-block;
  }

  h4 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #fff;
  }

  p {
    font-size: 0.95rem;
    color: #a0a3bd;
    line-height: 1.6;
  }
`;

const QuoteSection = styled.div`
  padding: 8rem 0;
  text-align: center;
  position: relative;
  
  svg {
    font-size: 4rem;
    color: var(--primary);
    margin-bottom: 2rem;
    opacity: 0.3;
  }

  blockquote {
    font-size: 2.5rem;
    font-style: italic;
    font-weight: 300;
    max-width: 1000px;
    margin: 0 auto;
    line-height: 1.4;
    color: white;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  
  span {
    padding: 0.6rem 1.2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 99px;
    font-size: 0.9rem;
    color: white;
    font-weight: 600;
  }
`;

const AboutPage = () => {
  return (
    <PageWrapper>
      <LandingNav />
      <FixedBackground>
        <AIModel />
      </FixedBackground>
      <ContentContainer>
        <PageContainer>
          <HeroSection>
            <h1>Redefining Justice</h1>
            <p>
              Lawyer.AI is an AI-powered legal assistance platform designed to help
              civilians, law students, and lawyers access legal knowledge and high-performance tools.
            </p>
          </HeroSection>

          {/* Introduction */}
          <Section>
            <VisualBlock><FaRocket /></VisualBlock>
            <ContentBlock>
              <h2><FaArrowRight size={24} /> Platform Introduction</h2>
              <p>
                In a world where legal processes can be overwhelming, Lawyer.AI acts as a
                bridge between complex law and the citizens who need it. We've built an
                ecosystem that transforms legal research from weeks to seconds, bringing a
                new level of clarity to the justice system.
              </p>
              <div className="accent-box">
                <span>Smart Litigation</span>
                We use Large Language Models (LLMs) specifically trained on Indian legal
                statutes and landmark judgments to provide reliable assistance.
              </div>
            </ContentBlock>
          </Section>

          {/* Mission */}
          <Section>
            <VisualBlock><FaBullseye /></VisualBlock>
            <ContentBlock>
              <h2><FaArrowRight size={24} /> Mission Statement</h2>
              <p>
                Our mission is to democratize legal information. We believe that knowing
                the law shouldn't be a privilege of the few, but a right accessible to
                every citizen in the country.
              </p>
              <p>
                We are committed to reducing the burden on the Indian judicial system
                by promoting informed legal discourse and providing students with
                unparalleled training simulators to become the next generation of jurists.
              </p>
            </ContentBlock>
          </Section>

          {/* Who Can Use */}
          <div style={{ marginBottom: '10rem' }}>
            <ContentBlock style={{ textAlign: 'center' }}>
              <h2><FaUsers /> Who Can Use the Platform?</h2>
              <p style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
                Lawyer.AI is designed with specialized features for every stakeholder
                in the legal journey.
              </p>
            </ContentBlock>
            <UserGrid>
              <UserCard>
                <div className="icon"><FaUsers /></div>
                <h4>Civilians</h4>
                <p>Understand your legal rights, search for IPC sections, and analyze your personal contracts without the legal jargon.</p>
              </UserCard>
              <UserCard>
                <div className="icon"><FaGraduationCap /></div>
                <h4>Law Students</h4>
                <p>Sharpen your skills with Moot Court simulators, generate case strategies, and access historical case data for study.</p>
              </UserCard>
              <UserCard>
                <div className="icon"><FaScaleBalanced /></div>
                <h4>Lawyers</h4>
                <p>Predict case outcomes using AI, organize your research, and collaborate securely with clients in Justice Rooms.</p>
              </UserCard>
            </UserGrid>
          </div>

          {/* Quote */}
          <QuoteSection>
            <FaQuoteLeft />
            <blockquote>
              "Technology is the ultimate equalizer in the pursuit of justice."
            </blockquote>
          </QuoteSection>

          {/* Technology */}
          <Section>
            <VisualBlock><FaMicrochip /></VisualBlock>
            <ContentBlock>
              <h2><FaArrowRight size={24} /> Technology Behind Lawyer.AI</h2>
              <p>
                Our platform is built on a sophisticated technical backbone combining
                real-time data processing with state-of-the-art Generative AI.
              </p>
              <p>
                We utilize a proprietary Legal Knowledge Base that indexes the Indian
                Penal Code and thousands of Supreme Court judgments, feeding them into
                advanced reasoning models to provide contextual legal support.
              </p>
              <TechStack>
                <span>Google Gemini AI</span>
                <span>Vector Search</span>
                <span>Indian Law Graph</span>
                <span>Edge Computing</span>
                <span>AES-256 Encryption</span>
              </TechStack>
            </ContentBlock>
          </Section>

        </PageContainer>
        <LandingFooter />
      </ContentContainer>
    </PageWrapper>
  );
};

export default AboutPage;
