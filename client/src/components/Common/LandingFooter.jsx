import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FooterMain = styled.footer`
  padding: 3rem 0 2rem;
  background: #080a10;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 50;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #6c5dd3 50%, transparent 100%);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  h4 {
    color: white;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.6rem;
  }

  a {
    color: #a0a3bd;
    text-decoration: none;
    transition: all 0.3s;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-block;

    &:hover {
      color: #6c5dd3;
      padding-left: 5px;
    }
  }

  p {
    font-size: 0.9rem;
    color: #a0a3bd;
    line-height: 1.6;
  }
`;

const Logo = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fff 0%, #a0a3bd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  margin-bottom: 1rem;

  span {
    color: var(--primary);
    -webkit-text-fill-color: initial;
    background: none;
  }
`;

const FooterBottom = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  
  a {
    color: #a0a3bd;
    transition: all 0.3s;
    
    &:hover {
      color: #6c5dd3;
      transform: translateY(-3px);
    }
  }
`;

const LandingFooter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHomeClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleNav = (path) => {
    navigate(path);
    // Scroll to top on navigation to public pages
    window.scrollTo(0, 0);
  };

  return (
    <FooterMain>
      <Container>
        <FooterGrid>
          <FooterColumn>
            <Logo onClick={handleHomeClick}>LAWYER<span>.AI</span></Logo>
            <p style={{ maxWidth: '300px' }}>
              The next generation of legal intelligence. Empowering people through AI-driven access to justice.
            </p>
          </FooterColumn>

          <FooterColumn>
            <h4>Company</h4>
            <ul>
              <li><a onClick={() => handleNav('/about')}>About Us</a></li>
              <li><a onClick={() => handleNav('/features')}>Features</a></li>
              <li><a onClick={() => handleNav('/contact')}>Connect</a></li>

            </ul>
          </FooterColumn>

          <FooterColumn>
            <h4>Resources</h4>
            <ul>
              <li><a onClick={() => handleNav('/docs')}>Documentation</a></li>
              <li><a onClick={() => handleNav('/help')}>Help Center</a></li>
              <li><a onClick={() => handleNav('/terms')}>Terms of Service</a></li>
              <li><a onClick={() => handleNav('/privacy')}>Privacy Policy</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h4>Contact</h4>
            <ul style={{ fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a3bd' }}><Mail size={14} /> hetbhalani44@gmail.com</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a3bd' }}><Phone size={14} /> +91 79848 49841</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a3bd' }}><MapPin size={14} /> Ahmedabad & Pune, India</li>
            </ul>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <p style={{ color: '#686a7d', fontSize: '0.85rem' }}>
            © 2024 Lawyer.AI. Created with ❤️ for Justice.
          </p>
          <SocialLinks>
            <a href="https://github.com/Hetshah1203"><Github size={18} /></a>
            {/*<a href="https://x.com/KikaniHet"><Twitter size={18} /></a>*/}
            <a href="https://www.linkedin.com/in/het-kikani-67817236b/"><Linkedin size={18} /></a>
            <a href="https://www.instagram.com/hetansh_3012"><Instagram size={18} /></a>
          </SocialLinks>
        </FooterBottom>
      </Container>
    </FooterMain>
  );
};

export default LandingFooter;
