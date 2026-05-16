import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import styled from 'styled-components';
import AnnouncementBanner from '../Dashboard/AnnouncementBanner';
import { FaChevronDown, FaChevronRight, FaChevronLeft, FaGauge, FaUsers, FaUserCheck, FaPenNib, FaFileLines, FaBullhorn, FaRobot, FaGear, FaHeadset, FaRightFromBracket } from 'react-icons/fa6';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-dark);
  color: var(--text-main);
  position: relative;
`;

const SidebarOverlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 90;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background-color: var(--bg-panel);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid var(--border);
  box-shadow: 10px 0 30px rgba(0,0,0,0.1);
  z-index: 100;

  @media (max-width: 1024px) {
    position: fixed;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarHeader = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--primary);
  background: rgba(255,255,255,0.02);

  img {
    height: 28px;
    width: auto;
  }

  .close-mobile {
    display: none;
    margin-left: auto;
    @media (max-width: 1024px) {
      display: block;
      cursor: pointer;
      color: var(--text-secondary);
    }
  }
`;

const NavList = styled.nav`
  padding: 1.25rem 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

const NavGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  justify-content: space-between;

  &:hover {
    color: var(--text-main);
    background: rgba(255,255,255,0.03);
  }

  .title-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const GroupContent = styled.div`
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.active ? 'var(--text-main)' : 'var(--text-secondary)'};
  background: ${props => props.active ? 'linear-gradient(90deg, var(--primary) 0%, #a066ff 100%)' : 'transparent'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  &:hover {
    color: var(--text-main);
    background: ${props => props.active ? '' : 'rgba(255,255,255,0.05)'};
    padding-left: ${props => props.active ? '' : '1.25rem'};
  }

  .icon {
    margin-right: 12px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
  }

  .badge {
    background: #ff4757;
    color: white;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 20px;
    margin-left: auto;
  }
`;

const SidebarFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid var(--border);
`;

const LogoutButton = styled.button`
  width: 100%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 600;

  &:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

const SidebarSection = ({ title, icon, children, pathPrefix, location, onNavClick }) => {
  const isInside = location.pathname.startsWith(pathPrefix);
  const [isOpen, setIsOpen] = useState(isInside);

  return (
    <NavGroup>
      <GroupHeader onClick={() => setIsOpen(!isOpen)}>
        <div className="title-wrap">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
      </GroupHeader>
      {isOpen && <GroupContent>{children}</GroupContent>}
    </NavGroup>
  );
};

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
`;

const Topbar = styled.header`
  background-color: var(--bg-panel);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid var(--border);

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-main);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 1025px) {
    display: none;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-main);
  
  .user-name {
    display: none;
    @media (min-width: 640px) {
      display: block;
      color: var(--primary);
      font-weight: bold;
    }
  }
`;

const ContentArea = styled.main`
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  background: radial-gradient(circle at 50% 50%, rgba(108, 93, 211, 0.03) 0%, transparent 100%);

  @media (min-width: 640px) { padding: 1.5rem; }
  @media (min-width: 1024px) { padding: 2.5rem; }
`;

const MaxWidthWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingLawyers, setPendingLawyers] = useState(0);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPendingLawyers = async () => {
      try {
        const res = await api.get('/api/admin/pending-lawyers');
        if (res.data.status === 'success') {
          setPendingLawyers(res.data.data.lawyers.length);
        }
      } catch (error) {
        console.error("Failed to fetch pending lawyers for layout", error);
      }
    };
    fetchPendingLawyers();
  }, [location.pathname]);

  // Close sidebar on location change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <LayoutContainer>
      <SidebarOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

        <Sidebar isOpen={sidebarOpen}>
          <SidebarHeader>
            <img src="/legalpal_logo.png" alt="Logo" />
            LEGALPAL ADMIN
            <div className="close-mobile" onClick={() => setSidebarOpen(false)}>
              <FaChevronLeft />
            </div>
          </SidebarHeader>
        <NavList>
          <NavItem to="/admin" active={isActive('/admin') ? 1 : 0}>
            <span className="icon"><FaGauge /></span>
            Dashboard
          </NavItem>

          <SidebarSection title="User Management" icon={<FaUsers />} pathPrefix="/admin/user" location={location}>
            <NavItem to="/admin/users" active={isActive('/admin/users') ? 1 : 0}>
              <span className="icon"><FaUsers size={14} /></span>
              Users
            </NavItem>
            <NavItem to="/admin/lawyers" active={isActive('/admin/lawyers') ? 1 : 0}>
              <span className="icon"><FaUserCheck size={14} /></span>
              Lawyer Verification
              {pendingLawyers > 0 && <span className="badge">{pendingLawyers}</span>}
            </NavItem>
          </SidebarSection>

          <SidebarSection title="Content" icon={<FaFileLines />} pathPrefix="/admin/c" location={location}>
            <NavItem to="/admin/blogs" active={isActive('/admin/blogs') ? 1 : 0}>
              <span className="icon"><FaPenNib size={14} /></span>
              Blogs
            </NavItem>
            <NavItem to="/admin/cases" active={isActive('/admin/cases') ? 1 : 0}>
              <span className="icon"><FaFileLines size={14} /></span>
              Case Library
            </NavItem>
            <NavItem to="/admin/announcements" active={isActive('/admin/announcements') ? 1 : 0}>
              <span className="icon"><FaBullhorn size={14} /></span>
              Announcements
            </NavItem>
          </SidebarSection>

          <NavItem to="/admin/ai-monitoring" active={isActive('/admin/ai-monitoring') ? 1 : 0}>
            <span className="icon"><FaRobot /></span>
            AI Usage Monitoring
          </NavItem>

          <SidebarSection title="Platform" icon={<FaGear />} pathPrefix="/admin/settings" location={location}>
            <NavItem to="/admin/settings" active={isActive('/admin/settings') ? 1 : 0}>
              <span className="icon"><FaGear size={14} /></span>
              Platform Settings
            </NavItem>
          </SidebarSection>

          <SidebarSection title="Support" icon={<FaHeadset />} pathPrefix="/admin/contacts" location={location}>
            <NavItem to="/admin/contacts" active={isActive('/admin/contacts') ? 1 : 0}>
              <span className="icon"><FaHeadset size={14} /></span>
              Support & Reports
            </NavItem>
          </SidebarSection>
        </NavList>

        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>
            <FaRightFromBracket /> Logout
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <AnnouncementBanner />
        <Topbar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>☰</MenuButton>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>Admin Portal</h3>
          </div>
          <UserMenu>
            <span className="user-name">{user?.name || 'Admin'}</span>
          </UserMenu>
        </Topbar>
        <ContentArea>
          <MaxWidthWrapper>
            <Outlet />
          </MaxWidthWrapper>
        </ContentArea>
      </MainContent>
    </LayoutContainer>

  );
};

export default AdminLayout;
