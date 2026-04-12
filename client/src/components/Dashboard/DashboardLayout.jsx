import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import LandingFooter from '../Common/LandingFooter';
import AnnouncementBanner from './AnnouncementBanner';
import { Outlet, useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text-main);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FullWidthContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const DashboardLayout = () => {
  const location = useLocation();

  // These pages should span the full width of the screen without container constraints
  const isFullWidthPage = [
    '/chat',
    '/courtroom',
    '/ipc',
    '/ai-chat',
    '/doc-analyzer',
    '/strategy-generator',
    '/moot-court',
    '/outcome-predictor',
    '/judicial-simulation',
    '/case-builder'
  ].some(path => {
    // Check if current path ends with this subpath or contains it after role prefix
    return location.pathname.endsWith(path) || 
           location.pathname.includes(`${path}/`);
  });

  return (
    <LayoutContainer $isFull={isFullWidthPage}>
      <Navbar />
      <AnnouncementBanner />
      {isFullWidthPage ? (
        <FullWidthContent>
          <Outlet />
        </FullWidthContent>
      ) : (
        <MainContent>
          <Outlet />
        </MainContent>
      )}
      <LandingFooter />
    </LayoutContainer>
  );
};

export default DashboardLayout;
