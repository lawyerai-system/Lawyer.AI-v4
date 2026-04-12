import React from 'react';
import styled from 'styled-components';
import { FaGavel } from 'react-icons/fa'; // Example Icon

const PanelWrapper = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background: #0b0d14;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(108,93,211,0.15) 0%, transparent 70%);
    filter: blur(50px);
    animation: pulse 8s infinite alternate;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 10%;
    right: 10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(255,117,76,0.1) 0%, transparent 70%);
    filter: blur(40px);
    animation: pulse 6s infinite alternate-reverse;
  }

  @keyframes pulse {
    from { transform: scale(1); opacity: 0.5; }
    to { transform: scale(1.2); opacity: 0.8; }
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    min-height: 300px;
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 32px;
  z-index: 1;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
`;

const LogoContainer = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  color: var(--primary);
  filter: drop-shadow(0 0 20px rgba(108, 93, 211, 0.4));
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #fff 0%, #a0a3bd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 350px;
  line-height: 1.6;
  margin-top: 1.5rem;
`;

const LogoPanel = () => {
  return (
    <PanelWrapper>
      <GlassCard>
        <LogoContainer>
          <FaGavel />
        </LogoContainer>
        <Title>Lawyer.AI</Title>
        <Subtitle>
          Elevating legal intelligence with the next generation of AI-driven research and consultation tools.
        </Subtitle>
      </GlassCard>
    </PanelWrapper>
  );
};

export default LogoPanel;
