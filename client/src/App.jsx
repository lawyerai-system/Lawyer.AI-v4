// Main App Entry
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignupPage from './pages/Auth/LoginSignupPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import FeaturesPage from './pages/Dashboard/FeaturesPage';
import AboutPage from './pages/Dashboard/AboutPage';
import ContactPage from './pages/Dashboard/ContactPage';

import DocumentationPage from './pages/Public/DocumentationPage';
import HelpCenterPage from './pages/Public/HelpCenterPage';
import TermsPage from './pages/Public/TermsPage';
import PrivacyPage from './pages/Public/PrivacyPage';
import ProfilePage from './pages/Dashboard/ProfilePage';
import ChatPage from './pages/Dashboard/ChatPage';
import BlogPage from './pages/Dashboard/Blog/BlogPage';
import IPCPage from './pages/Dashboard/IPC/IPCPage';
import BlogCreate from './pages/Dashboard/Blog/BlogCreate';
import BlogEdit from './pages/Dashboard/Blog/BlogEdit';
import BlogDetail from './pages/Dashboard/Blog/BlogDetail';
import CourtroomPage from './pages/Dashboard/Courtroom/CourtroomPage';
import DocumentAnalyzer from './pages/Dashboard/DocumentAnalyzer/DocumentAnalyzer';
import LegalStrategyGenerator from './pages/Dashboard/Strategy/LegalStrategyGenerator';
import MootCourtSimulator from './pages/Dashboard/MootCourt/MootCourtSimulator';
import CaseLibrary from './pages/Dashboard/CaseLibrary/CaseLibrary';
import UploadCase from './pages/Dashboard/CaseLibrary/UploadCase';
import CaseDetails from './pages/Dashboard/CaseLibrary/CaseDetails';
import CasePredictor from './pages/Dashboard/Predictor/CasePredictor';
import CourtSimulation from './pages/Dashboard/Simulation/CourtSimulation';
import AICaseBuilder from './pages/Dashboard/Builder/AICaseBuilder';
import { ResearchHub, PracticeHub, AcademyHub, CommunityHub } from './pages/Dashboard/Hubs/Hubs';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import LawyerManagement from './pages/Admin/LawyerManagement';
import BlogManagement from './pages/Admin/BlogManagement';
import ContactManagement from './pages/Admin/ContactManagement';
import CaseManagement from './pages/Admin/CaseManagement';
import IPCManagement from './pages/Admin/IPCManagement';
import MootManagement from './pages/Admin/MootManagement';
import RoomManagement from './pages/Admin/RoomManagement';
import AIMonitoring from './pages/Admin/AIMonitoring';
import AnnouncementManagement from './pages/Admin/AnnouncementManagement';
import SettingsManagement from './pages/Admin/SettingsManagement';
import ProtectedAdminRoute from './components/Auth/ProtectedAdminRoute';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import RoleProtectedRoute from './components/Auth/RoleProtectedRoute';
import RoleRedirect from './components/Auth/RoleRedirect';

import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/Common/ScrollToTop';
import LandingPage from './pages/Landing/LandingPage';
import MaintenanceBanner from './components/Dashboard/MaintenanceBanner';
import MaintenanceWatcher from './components/Common/MaintenanceWatcher';
import MaintenanceModal from './components/Common/MaintenanceModal';

function App() {
  return (
    <AuthProvider>
      <Router>
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

            {/* Legacy /dashboard redirector */}
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
                <Route path="practice" element={<PracticeHub />} />
                <Route path="academy" element={<AcademyHub />} />
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
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SettingsProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
