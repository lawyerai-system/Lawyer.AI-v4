import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaXmark, FaRightFromBracket, FaUser, FaChevronDown, FaFileLines, FaBrain, FaGavel, FaScaleBalanced, FaMicrochip, FaListCheck } from 'react-icons/fa6';
import { useSettings } from '../../context/SettingsContext';
import UserAvatar from '../Common/UserAvatar';

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 2000;
  background: rgba(15, 17, 26, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    padding: 1.2rem 1.5rem; // Increased vertical padding on mobile for less 'congestion'
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoIcon = styled.div`
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6c5dd3 0%, #a0e6ff 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(108, 93, 211, 0.3);
  color: white;
  font-size: 1.2rem;
`;

const LogoText = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #ffffff 0%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -1px;
  text-transform: uppercase;
  
  span {
    color: var(--primary);
    -webkit-text-fill-color: var(--primary);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem 1.5rem;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const StyledLink = styled(NavLink)`
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  position: relative;

  &:hover {
    color: white;
  }

  &.active {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0.6rem 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(108, 93, 211, 0.3);
  }
`;

const ProfileImage = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  overflow: hidden;
  border: 2px solid rgba(108, 93, 211, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  text-align: right;

  .name {
    font-size: 0.85rem;
    font-weight: 700;
    color: white;
    display: block;
    line-height: 1;
    margin-bottom: 2px;
    max-width: 100px; /* Truncate long names */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
      max-width: 80px;
    }
  }

  .role {
    font-size: 0.7rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(108, 93, 211, 0.2); }
  50% { box-shadow: 0 0 15px rgba(108, 93, 211, 0.5); }
  100% { box-shadow: 0 0 5px rgba(108, 93, 211, 0.2); }
`;

const MobileMenuBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: none; // Hidden by default on PC
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    display: flex; // Only show on mobile/tab
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 85%);
  height: 100vh;
  background: #0f111a;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1001;
  box-shadow: -20px 0 60px rgba(0,0,0,0.8);
  overflow-y: auto; // Fixed: Allow scrolling inside sidebar
  -webkit-overflow-scrolling: touch;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.4s;
`;

const ToolsDropdownWrapper = styled.div`
  position: relative;
`;

const DropdownLabel = styled.div`
  color: ${props => props.$isOpen ? 'white' : '#94a3b8'};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  transition: all 0.3s;
  background: ${props => props.$isOpen ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border-radius: 8px;

  &:hover { 
    color: white; 
    background: rgba(255, 255, 255, 0.03);
  }
`;

const ToolsPanel = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.$isOpen ? '0' : '10px'});
  background: #1a1d2d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1rem;
  min-width: 280px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: #1a1d2d;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const ToolItemLink = styled(Link)`
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  .icon-wrap {
    width: 40px;
    height: 40px;
    background: rgba(108, 93, 211, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 1.2rem;
    transition: all 0.3s;
  }

  .text-wrap {
    display: flex;
    flex-direction: column;
    span { font-size: 0.95rem; font-weight: 600; color: white; margin-bottom: 2px; }
    small { font-size: 0.75rem; color: #64748b; }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateX(5px);
    .icon-wrap { background: var(--primary); color: white; }
    span { color: var(--primary); }
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #1a1d2d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 0.8rem;
  width: 220px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2000;
  margin-top: 10px;

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    right: 25px;
    width: 12px;
    height: 12px;
    background: #1a1d2d;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    transform: rotate(45deg);
  }
`;

const DropdownAction = styled.div`
  padding: 0.9rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    .icon { color: var(--primary); }
  }

  &.logout {
    color: #ef4444;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    &:hover { background: rgba(239, 68, 68, 0.1); }
  }
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  padding: 2px 6px;
  background: rgba(108, 93, 211, 0.1);
  color: var(--primary);
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  margin-left: 6px;
  border: 1px solid rgba(108, 93, 211, 0.2);
  
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--primary);
    border-radius: 50%;
    animation: ${glow} 1.5s infinite;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isFeatureEnabled } = useSettings();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };


    const getRolePrefix = () => {
        if (!user) return '/dashboard';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'lawyer') return '/lawyer';
        if (user.role === 'law_student') return '/student';
        if (user.role === 'civilian') return '/civilian';
        return '/dashboard';
    };

    const resolvePath = (path) => {
        // Remove existing /dashboard prefix if present to avoid double prefixing
        const cleanPath = path.startsWith('/dashboard') ? path.replace('/dashboard', '') : path;
        // If it's the root dashboard path
        if (cleanPath === '' || cleanPath === '/') {
            return user?.role === 'admin' ? '/admin' : `${getRolePrefix()}/dashboard`;
        }
        return `${getRolePrefix()}${cleanPath}`;
    };

    const getDashboardPath = () => {
        if (!user) return '/dashboard';
        const map = {
            'admin': '/admin',
            'lawyer': '/lawyer/dashboard',
            'law_student': '/student/dashboard',
            'civilian': '/civilian/dashboard'
        };
        return map[user.role] || '/dashboard';
    };

  return (
    <>
      <NavContainer>
        <LogoLink to={getDashboardPath()}>
          <LogoIcon><FaMicrochip /></LogoIcon>
          <LogoText>LAWYER<span>.AI</span></LogoText>
        </LogoLink>

        <NavLinks>
          <StyledLink to={resolvePath('/research')}>Research</StyledLink>

          {(user?.role === 'lawyer' || user?.role === 'law_student' || user?.role === 'admin') && (
            <StyledLink to={resolvePath('/practice')}>Practice</StyledLink>
          )}

          {(user?.role === 'lawyer' || user?.role === 'law_student' || user?.role === 'admin') && (
            <StyledLink to={resolvePath('/academy')}>Academy</StyledLink>
          )}

          <StyledLink to={resolvePath('/community')}>Community</StyledLink>
        </NavLinks>

        <div style={{ position: 'relative' }}>
          <ProfileButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <UserInfo>
              <span className="name">{user?.name || 'User'}</span>
              <span className="role">{user?.role?.replace('_', ' ')}</span>
            </UserInfo>
            <ProfileImage>
              <UserAvatar 
                src={user?.profilePicture || user?.profileImage} 
                name={user?.name || 'User'} 
                size="34px" 
              />
            </ProfileImage>
          </ProfileButton>

          <UserDropdown $isOpen={isDropdownOpen} onMouseLeave={() => setIsDropdownOpen(false)}>
            <DropdownAction onClick={() => { navigate(resolvePath('/profile')); setIsDropdownOpen(false); }}>
              <FaUser className="icon" /> My Profile
            </DropdownAction>
            <DropdownAction className="logout" onClick={handleLogout}>
              <FaRightFromBracket className="icon" /> Sign Out
            </DropdownAction>
          </UserDropdown>
        </div>

        <MobileMenuBtn onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <FaXmark /> : <FaBars />}
        </MobileMenuBtn>
      </NavContainer>

      <Overlay $isOpen={isMobileOpen} onClick={() => setIsMobileOpen(false)} />

      <MobileMenu $isOpen={isMobileOpen}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <LogoLink to={getDashboardPath()} onClick={() => setIsMobileOpen(false)}>
            <LogoIcon><FaMicrochip /></LogoIcon>
            <LogoText>LAWYER<span>.AI</span></LogoText>
          </LogoLink>
          <MobileMenuBtn onClick={() => setIsMobileOpen(false)}>
            <FaXmark />
          </MobileMenuBtn>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          <StyledLink to={resolvePath('/research')} onClick={() => setIsMobileOpen(false)}>Research Hub</StyledLink>

          {(user?.role === 'lawyer' || user?.role === 'law_student' || user?.role === 'admin') && (
            <StyledLink to={resolvePath('/practice')} onClick={() => setIsMobileOpen(false)}>Practice Jam</StyledLink>
          )}

          {(user?.role === 'lawyer' || user?.role === 'law_student' || user?.role === 'admin') && (
            <StyledLink to={resolvePath('/academy')} onClick={() => setIsMobileOpen(false)}>Academy</StyledLink>
          )}

          <StyledLink to={resolvePath('/community')} onClick={() => setIsMobileOpen(false)}>Community</StyledLink>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <ProfileImage style={{ width: '45px', height: '45px' }}>
              <UserAvatar 
                src={user?.profilePicture || user?.profileImage} 
                name={user?.name || 'User'} 
                size="45px" 
              />
            </ProfileImage>
            <UserInfo style={{ textAlign: 'left' }}>
              <span className="name" style={{ fontSize: '1rem' }}>{user?.name}</span>
              <span className="role">{user?.role?.replace('_', ' ')}</span>
            </UserInfo>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <DropdownAction onClick={() => { navigate(resolvePath('/profile')); setIsMobileOpen(false); }} style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'center' }}>
              Profile
            </DropdownAction>
            <DropdownAction className="logout" onClick={handleLogout} style={{ justifyContent: 'center' }}>
              Sign Out
            </DropdownAction>
          </div>
        </div>
      </MobileMenu>
    </>
  );
};

export default Navbar;
