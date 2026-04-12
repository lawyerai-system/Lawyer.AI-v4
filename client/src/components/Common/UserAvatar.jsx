import React from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa6';

const AvatarContainer = styled.div`
  width: ${props => props.$size || '40px'};
  height: ${props => props.$size || '40px'};
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    font-size: ${props => `calc(${props.$size || '40px'} / 2.2)`};
    text-transform: uppercase;
    font-family: inherit;
  }
`;

const UserAvatar = ({ src, name, size, className }) => {
  const hasImage = src && src !== 'default.jpg' && src !== '/default.jpg' && src !== '';

  const renderContent = () => {
    if (hasImage) {
      const fullUrl = src.startsWith('http') ? src : `${src.startsWith('/') ? '' : '/'}${src}`;
      return <img src={fullUrl} alt={name || 'User'} onError={(e) => { e.target.style.display = 'none'; }} />;
    }
    
    if (name) {
      return <span className="initials">{name.trim().charAt(0)}</span>;
    }
    
    return <FaUser size={`calc(${size || '40px'} / 2)`} />;
  };

  return (
    <AvatarContainer $size={size} className={className}>
      {renderContent()}
    </AvatarContainer>
  );
};

export default UserAvatar;
