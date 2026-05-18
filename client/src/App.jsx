// Main App Entry
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context & Auth (Keep these eager)
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProtectedAdminRoute from './components/Auth/ProtectedAdminRoute';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';
import RoleRedirect from './components/Auth/RoleRedirect';
import MaintenanceWatcher from './components/Common/MaintenanceWatcher';
import './index.css';

// Components (Shared)
import ScrollToTop from './components/Common/ScrollToTop';
import MaintenanceBanner from './components/Dashboard/MaintenanceBanner';
import MaintenanceModal from './components/Common/MaintenanceModal';

// --- Lazy Loaded Pages ---

// Auth
const LoginSignupPage = lazy(() => import('./pages/Auth/LoginSignupPage'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

// Landing & Public
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/Dashboard/FeaturesPage'));
const AboutPage = lazy(() => import('./pages/Dashboard/AboutPage'));
const ContactPage = lazy(() => import('./pages/Dashboard/ContactPage'));
const DocumentationPage = lazy(() => import('./pages/Public/DocumentationPage'));
const HelpCenterPage = lazy(() => import('./pages/Public/HelpCenterPage'));
const TermsPage = lazy(() => import('./pages/Public/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/Public/PrivacyPage'));

// Dashboard Core
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'));
const ProfilePage = lazy(() => import('./pages/Dashboard/ProfilePage'));
const ChatPage = lazy(() => import('./pages/Dashboard/ChatPage'));

// Features
const BlogPage = lazy(() => import('./pages/Dashboard/Blog/BlogPage'));
const IPCPage = lazy(() => import('./pages/Dashboard/IPC/IPCPage'));
const BlogCreate = lazy(() => import('./pages/Dashboard/Blog/BlogCreate'));
const BlogEdit = lazy(() => import('./pages/Dashboard/Blog/BlogEdit'));
const BlogDetail = lazy(() => import('./pages/Dashboard/Blog/BlogDetail'));
const CourtroomPage = lazy(() => import('./pages/Dashboard/Courtroom/CourtroomPage'));
const DocumentAnalyzer = lazy(() => import('./pages/Dashboard/DocumentAnalyzer/DocumentAnalyzer'));
const LegalStrategyGenerator = lazy(() => import('./pages/Dashboard/Strategy/LegalStrategyGenerator'));
const MootCourtSimulator = lazy(() => import('./pages/Dashboard/MootCourt/MootCourtSimulator'));
const CaseLibrary = lazy(() => import('./pages/Dashboard/CaseLibrary/CaseLibrary'));
const UploadCase = lazy(() => import('./pages/Dashboard/CaseLibrary/UploadCase'));
const CaseDetails = lazy(() => import('./pages/Dashboard/CaseLibrary/CaseDetails'));
const CasePredictor = lazy(() => import('./pages/Dashboard/Predictor/CasePredictor'));
const CourtSimulation = lazy(() => import('./pages/Dashboard/Simulation/CourtSimulation'));
const AICaseBuilder = lazy(() => import('./pages/Dashboard/Builder/AICaseBuilder'));
const ResearchHub = lazy(() => import('./pages/Dashboard/Hubs/Hubs').then(module => ({ default: module.ResearchHub })));
const PracticeHub = lazy(() => import('./pages/Dashboard/Hubs/Hubs').then(module => ({ default: module.PracticeHub })));
const AcademyHub = lazy(() => import('./pages/Dashboard/Hubs/Hubs').then(module => ({ default: module.AcademyHub })));
const CommunityHub = lazy(() => import('./pages/Dashboard/Hubs/Hubs').then(module => ({ default: module.CommunityHub })));

// Admin
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const LawyerManagement = lazy(() => import('./pages/Admin/LawyerManagement'));
const BlogManagement = lazy(() => import('./pages/Admin/BlogManagement'));
const ContactManagement = lazy(() => import('./pages/Admin/ContactManagement'));
const CaseManagement = lazy(() => import('./pages/Admin/CaseManagement'));
const IPCManagement = lazy(() => import('./pages/Admin/IPCManagement'));
const MootManagement = lazy(() => import('./pages/Admin/MootManagement'));
const RoomManagement = lazy(() => import('./pages/Admin/RoomManagement'));
const AIMonitoring = lazy(() => import('./pages/Admin/AIMonitoring'));
const AnnouncementManagement = lazy(() => import('./pages/Admin/AnnouncementManagement'));
const SettingsManagement = lazy(() => import('./pages/Admin/SettingsManagement'));

// --- Loading Component ---
const LoadingScreen = () => (
  <div style={{ 
    height: '100vh', 
    width: '100vw', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    background: '#0b0d14',
    color: '#fff',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div className="loader"></div>
    <style>{`
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #fff;
        border-bottom-color: #6c5dd3;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }
      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <MaintenanceModal />
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
          <SettingsProvider>
            <MaintenanceBanner />
            <MaintenanceWatcher />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<LoginSignupPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/login-redirect" element={<RoleRedirect />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/docs" element={<DocumentationPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              <Route path="/dashboard/*" element={<RoleRedirect />} />

              {/* Lawyer Dashboard */}
              <Route path="/lawyer" element={
                <RoleProtectedRoute allowedRoles={['lawyer']}>
                  <SocketProvider>
                    <ChatProvider>
                      <DashboardLayout />
                    </ChatProvider>
                  </SocketProvider>
                </RoleProtectedRoute>
              }>
                <Route index element={<RoleRedirect />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/create" element={<BlogCreate />} />
                <Route path="blog/edit/:id" element={<BlogEdit />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="courtroom" element={<CourtroomPage />} />
                <Route path="ipc" element={<IPCPage />} />
                <Route path="doc-analyzer" element={<DocumentAnalyzer />} />
                <Route path="strategy-generator" element={<LegalStrategyGenerator />} />
                <Route path="moot-court" element={<MootCourtSimulator />} />
                <Route path="case-library" element={<CaseLibrary />} />
                <Route path="case-library/upload" element={<UploadCase />} />
                <Route path="case-library/:id" element={<CaseDetails />} />
                <Route path="outcome-predictor" element={<CasePredictor />} />
                <Route path="judicial-simulation" element={<CourtSimulation />} />
                <Route path="case-builder" element={<AICaseBuilder />} />
                <Route path="research" element={<ResearchHub />} />
                <Route path="practice" element={<PracticeHub />} />
                <Route path="academy" element={<AcademyHub />} />
                <Route path="community" element={<CommunityHub />} />
              </Route>

              {/* Student Dashboard */}
              <Route path="/student" element={
                <RoleProtectedRoute allowedRoles={['law_student']}>
                  <SocketProvider>
                    <ChatProvider>
                      <DashboardLayout />
                    </ChatProvider>
                  </SocketProvider>
                </RoleProtectedRoute>
              }>
                <Route index element={<RoleRedirect />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="ipc" element={<IPCPage />} />
                <Route path="doc-analyzer" element={<DocumentAnalyzer />} />
                <Route path="strategy-generator" element={<LegalStrategyGenerator />} />
                <Route path="moot-court" element={<MootCourtSimulator />} />
                <Route path="case-library" element={<CaseLibrary />} />
                <Route path="case-library/upload" element={<UploadCase />} />
                <Route path="case-library/:id" element={<CaseDetails />} />
                <Route path="case-builder" element={<AICaseBuilder />} />
                <Route path="research" element={<ResearchHub />} />
                <Route path="practice" element={<PracticeHub />} />
                <Route path="academy" element={<AcademyHub />} />
                <Route path="community" element={<CommunityHub />} />
              </Route>

              {/* Civilian Dashboard */}
              <Route path="/civilian" element={
                <RoleProtectedRoute allowedRoles={['civilian']}>
                  <SocketProvider>
                    <ChatProvider>
                      <DashboardLayout />
                    </ChatProvider>
                  </SocketProvider>
                </RoleProtectedRoute>
              }>
                <Route index element={<RoleRedirect />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="courtroom" element={<CourtroomPage />} />
                <Route path="ipc" element={<IPCPage />} />
                <Route path="research" element={<ResearchHub />} />
                <Route path="community" element={<CommunityHub />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <SocketProvider>
                    <AdminLayout />
                  </SocketProvider>
                </ProtectedAdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="lawyers" element={<LawyerManagement />} />
                <Route path="blogs" element={<BlogManagement />} />
                <Route path="contacts" element={<ContactManagement />} />
                <Route path="cases" element={<CaseManagement />} />
                <Route path="ipc" element={<IPCManagement />} />
                <Route path="moots" element={<MootManagement />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="ai-monitoring" element={<AIMonitoring />} />
                <Route path="announcements" element={<AnnouncementManagement />} />
                <Route path="settings" element={<SettingsManagement />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="research" element={<ResearchHub />} />
                <Route path="practice" element={<PracticeHub />} />
                <Route path="academy" element={<AcademyHub />} />
                <Route path="community" element={<CommunityHub />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SettingsProvider>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
