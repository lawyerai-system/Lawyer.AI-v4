import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBullhorn, FaTimes } from 'react-icons/fa';
import api from '../../utils/axios';
import { useSocketContext } from '../../context/SocketContext';

const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const getColors = (type) => {
  switch (type) {
    case 'alert':
      return {
        bg: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)',
        accent: '#ff416c'
      };
    case 'maintenance':
      return {
        bg: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
        accent: '#f7971e'
      };
    case 'resource':
      return {
        bg: 'linear-gradient(90deg, #00b09b 0%, #96c93d 100%)',
        accent: '#00b09b'
      };
    case 'feature':
    default:
      return {
        bg: 'linear-gradient(90deg, #6c5dd3 0%, #a066ff 100%)',
        accent: '#6c5dd3'
      };
  }
};

const BannerContainer = styled.div`
  background: ${props => getColors(props.type).bg};
  color: white;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 900;
  animation: ${slideDown} 0.5s ease-out;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  font-weight: 500;

  .icon {
    background: rgba(255,255,255,0.2);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .type {
    background: white;
    color: ${props => getColors(props.type).accent};
    font-size: 0.7rem;
    padding: 0.1rem 0.5rem;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 800;
  }
`;

const DismissBtn = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { socketValue, resetSocketValue } = useSocketContext();

  // Initial Fetch
  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const res = await api.get('/api/announcements/active');
        if (res.data.success && res.data.data.length > 0) {
          const latest = res.data.data[0];
          const dismissedId = localStorage.getItem('last_dismissed_announcement');
          if (dismissedId !== latest._id) {
            setAnnouncement(latest);
            setIsVisible(true);
          }
        }
      } catch (err) {
        console.error("Announcement fetch failed", err);
      }
    };
    fetchActiveAnnouncement();
  }, []);

  // Socket Listener
  useEffect(() => {
    if (socketValue?.announcementNotify) {
      const liveAnnouncement = socketValue.announcementNotify;
      setAnnouncement(liveAnnouncement);
      setIsVisible(true);
      // Clear the notify value so it doesn't trigger again on re-render
      resetSocketValue('announcementNotify');
      // If a new announcement comes in, we should probably clear the old dismissal
      localStorage.removeItem('last_dismissed_announcement');
    }
  }, [socketValue?.announcementNotify]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (announcement) {
      localStorage.setItem('last_dismissed_announcement', announcement._id);
    }
  };

  if (!isVisible || !announcement) return null;

  return (
    <BannerContainer type={announcement.type}>
      <Content type={announcement.type}>
        <div className="icon"><FaBullhorn /></div>
        <span className="type">{announcement.type}</span>
        <strong>{announcement.title}:</strong>
        <span>{announcement.content}</span>
      </Content>
      <DismissBtn onClick={handleDismiss}>
        <FaTimes size={18} />
      </DismissBtn>
    </BannerContainer>
  );
};

export default AnnouncementBanner;
