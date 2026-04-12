import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: ${props => props.$scrolled ? '1rem 0' : '1.5rem 0'};
  background: ${props => props.$scrolled ? 'rgba(11, 13, 20, 0.8)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: 1px solid ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  
  span {
    background: linear-gradient(135deg, #6c5dd3 0%, #ff754c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;

  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${props => props.$active ? '#fff' : '#a0a3bd'};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background: linear-gradient(90deg, #6c5dd3, #ff754c);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #fff;
    &::after {
      width: 100%;
    }
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const LoginBtn = styled.button`
  background: ${props => props.$primary ? 'linear-gradient(90deg, #6c5dd3 0%, #ff754c 100%)' : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.$primary ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
  color: #fff;
  padding: 0.7rem 1.6rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.$primary ? '0 10px 20px rgba(108, 93, 211, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$primary ? 'linear-gradient(90deg, #5a4cb4 0%, #e66a44 100%)' : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: ${props => props.$primary ? '0 15px 30px rgba(108, 93, 211, 0.3)' : 'none'};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0b0d14;
  z-index: 999;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MobileLink = styled.a`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LandingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const navItems = [
    { label: 'Features', path: '/features' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <Nav $scrolled={scrolled}>
        <Container>
          <Logo onClick={handleHomeClick}>LAWYER<span>.AI</span></Logo>
          
          <NavLinks>
            {navItems.map(item => (
              <NavLink 
                key={item.path}
                onClick={() => navigate(item.path)}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </NavLinks>

          <ActionButtonGroup>
            {user ? (
              <LoginBtn $primary onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={18} />
                Dashboard
              </LoginBtn>
            ) : (
              <LoginBtn $primary onClick={() => navigate('/auth')}>
                Get Started
                <ChevronRight size={18} />
              </LoginBtn>
            )}
            
            <MenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </MenuButton>
          </ActionButtonGroup>
        </Container>
      </Nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileOverlay
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <MobileLink 
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                  <ChevronRight size={32} />
                </MobileLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: 'auto' }}
            >
              <LoginBtn 
                $primary 
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', justifyContent: 'center' }}
                onClick={() => {
                  navigate(user ? '/dashboard' : '/auth');
                  setMobileMenuOpen(false);
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started Now'}
              </LoginBtn>
            </motion.div>
          </MobileOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNav;
