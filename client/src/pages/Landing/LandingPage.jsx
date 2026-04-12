import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Search, Gavel, BookOpen, ChevronRight, PlayCircle, Scale } from 'lucide-react';
import AIModel from '../../components/Landing/AIModel';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';

// --- Styled Components ---

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
`;

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

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentCard = styled(motion.div)`
  background: rgba(26, 29, 45, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3.5rem;
  border-radius: 40px;
  width: 100%;
  text-align: center;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #a0a3bd;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled(motion.div)`
  background: rgba(255,255,255,0.03);
  padding: 2.5rem;
  border-radius: 32px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(108, 93, 211, 0.1);
    border-color: rgba(108, 93, 211, 0.4);
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  h4 { margin: 0; font-size: 1.4rem; color: #fff; }
  p { margin: 0; font-size: 1rem; color: #8e8ea0; }
`;

const MainCTA = styled.button`
  background: linear-gradient(90deg, #6c5dd3 0%, #ff754c 100%);
  border: none;
  color: white;
  padding: 1.2rem 3rem;
  border-radius: 18px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(108, 93, 211, 0.4);

  &:hover { 
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(108, 93, 211, 0.6);
  }
`;

const DemoImage = styled(motion.img)`
  width: 100%;
  border-radius: 32px;
  border: 12px solid #1a1d2d;
  box-shadow: 0 60px 120px rgba(0,0,0,0.7);
  margin-top: 3rem;
`;

// --- Main Component ---

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <LandingNav />

      <FixedBackground>
        <AIModel />
      </FixedBackground>

      <ContentContainer>
        {/* --- Hero Section --- */}
        <Section id="hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <HeroTitle>Future of Legal <br /> Intelligence.</HeroTitle>
            <Subtitle>
              Experience the world's most advanced AI-powered legal assistance platform. Built for citizens, students, and legal professionals.
            </Subtitle>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <MainCTA onClick={() => navigate('/auth')}>
                Get Started <ChevronRight size={22} />
              </MainCTA>
              <button style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: '1.2rem 2rem',
                borderRadius: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                fontSize: '1.1rem',
                fontWeight: 600
              }}>
                <PlayCircle size={24} /> Watch Demo
              </button>
            </div>
          </motion.div>
        </Section>

        {/* --- Features Section --- */}
        <Section id="features">
          <ContentCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800 }}>Core AI Modules</h2>
            <Subtitle>Our platform brings together deep legal expertise and cutting-edge machine learning.</Subtitle>

            <FeaturesGrid>
              <FeatureItem
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Bot color="#6c5dd3" size={48} />
                <h4>AI Chat</h4>
                <p>Expert legal consultation powered by state-of-the-art AI Models.</p>
              </FeatureItem>

              <FeatureItem
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Search color="#ff754c" size={48} />
                <h4>IPC Finder</h4>
                <p>Blazing fast search through the entire Indian Penal Code.</p>
              </FeatureItem>

              <FeatureItem
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Gavel color="#6c5dd3" size={48} />
                <h4>Virtual Courtroom</h4>
                <p>Immersive AI environment for practice and simulations.</p>
              </FeatureItem>

              <FeatureItem
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <BookOpen color="#ff754c" size={48} />
                <h4>Knowledge Hub</h4>
                <p>Curated legal blogs and resources for students and pros.</p>
              </FeatureItem>
            </FeaturesGrid>
          </ContentCard>
        </Section>

        {/* --- Dashboard Preview Section --- */}
        <Section id="preview">
          <div style={{ textAlign: 'center', width: '100%' }}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}
            >
              Unified Experience
            </motion.h2>
            <Subtitle>Manage everything from a single, intuitive dashboard.</Subtitle>
            <DemoImage
              src="/images/real_dashboard.png"
              alt="Dashboard"
              initial={{ opacity: 0, rotateX: 15 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </Section>

        {/* --- CTA Section --- */}
        <Section id="cta">
          <ContentCard
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(108, 93, 211, 0.15) 0%, rgba(255, 117, 76, 0.15) 100%)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Scale size={70} color="#6c5dd3" style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Ready to automate your legal research?
            </h2>
            <Subtitle>Join thousands of users leveraging AI for faster, smarter legal results.</Subtitle>
            <MainCTA onClick={() => navigate('/auth')}>Launch Lawyer.AI Now</MainCTA>
          </ContentCard>
        </Section>

        <LandingFooter />
      </ContentContainer>
    </PageWrapper>
  );
};

export default LandingPage;
