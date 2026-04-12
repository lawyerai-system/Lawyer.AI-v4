import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLocationDot, FaGlobe, FaBriefcase, FaGraduationCap, FaCamera, FaRightFromBracket, FaTrash, FaXmark, FaClock, FaCalendarDays, FaChartSimple, FaClockRotateLeft, FaKey, FaShieldHalved, FaRobot, FaBars } from 'react-icons/fa6';
import api from '../../utils/axios';
import { toast } from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropUtils';
import UserAvatar from '../../components/Common/UserAvatar';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

const ProfileHeader = styled.div`
  background: var(--bg-panel);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  border: 4px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EditAvatarBtn = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--accent);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: transform 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);

  &:hover {
    transform: scale(1.1);
  }
`;

const HeaderInfo = styled.div`
  flex: 1;

  .name-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
    
    h1 {
      margin: 0;
      font-size: 2.22rem;
      font-weight: 800;
      color: var(--text-main);
    }
  }

  .email-row {
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
    font-size: 1rem;
    opacity: 0.8;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      color: var(--text-secondary);
      font-size: 0.85rem;
      
      svg { color: var(--primary); }
      strong { color: var(--text-main); margin-left: auto; }
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.5rem;
  }

  .badge {
    background: rgba(108, 93, 211, 0.1);
    color: var(--primary);
    padding: 0.4rem 1rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid rgba(108, 93, 211, 0.2);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const ActionBtn = styled.button`
  background: ${props => props.$variant === 'primary' ? 'var(--primary)' : props.$variant === 'danger' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255,255,255,0.03)'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.$variant === 'danger' ? '#ff4d4d' : 'var(--text-main)'};
  border: 1px solid ${props => props.$variant === 'primary' ? 'transparent' : props.$variant === 'danger' ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255,255,255,0.05)'};
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$variant === 'primary' ? 'var(--primary-hover)' : props.$variant === 'danger' ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const FormSection = styled.div`
  background: var(--bg-panel);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  margin-top: 2rem;

  h3 {
    margin: 0 0 2rem 0;
    color: var(--primary);
    font-size: 1.4rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ToggleEditBtn = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-5px);
    background: rgba(108, 93, 211, 0.05);
  }

  .value {
    display: block;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 0.4rem;
  }

  .label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
`;

const Modal = styled.div`
  background: var(--bg-panel);
  padding: 2.5rem;
  border-radius: 24px;
  width: 90%;
  max-width: 450px;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 3001;

  h3 {
    margin: 0 0 1.5rem 0;
    color: var(--text-main);
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }

  .modal-desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    color: var(--text-secondary);
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    
    svg { color: var(--primary); font-size: 1rem; }
  }

  input, select {
    background: var(--bg-dark);
    border: 1px solid var(--border);
    padding: 0.9rem 1.1rem;
    border-radius: 12px;
    color: #fff;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      border-color: transparent;
      background: rgba(255,255,255,0.02);
    }

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: rgba(108, 93, 211, 0.05);
      box-shadow: 0 0 0 3px rgba(108, 93, 211, 0.15);
    }
  }
`;

const CropperContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 3000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const CropperWrapper = styled.div`
    position: relative;
    width: 90%;
    max-width: 500px;
    height: 400px;
    background: #333;
    border-radius: 12px;
    overflow: hidden;
`;

const CropperControls = styled.div`
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
`;

const MainLayout = styled.div`
  width: 100%;
`;

const StyledFormSection = styled(FormSection)`
    padding: 1.5rem;
    overflow: hidden;
`;

const ControlBtn = styled.button`
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    background: ${props => props.$primary ? 'var(--primary)' : 'var(--bg-panel)'};
    color: ${props => props.$primary ? 'white' : 'var(--text-main)'};
    border: 1px solid ${props => props.$primary ? 'transparent' : 'var(--border)'};

    &:hover {
        opacity: 0.9;
    }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.$type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 1rem;
  transform: ${props => props.$show ? 'translateX(0)' : 'translateX(200%)'};
  transition: transform 0.4s ease-in-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);

  font-weight: 500;
`;

const ProfilePage = () => {
  const { user, updateProfile, updateUserState, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Initial state based on legacy profile fields
  const [formData, setFormData] = useState({
    profileImage: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    nation: '',
    gender: 'male',
    language: 'english',
    profession: '',
    experience: '',
    specialization: '',
    barCouncilId: '',
    universityName: '',
    yearOfStudy: '',
    studentId: '',
    dob: ''
  });

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    // If onboarding, auto-enable editing
    if (state?.onboarding) {
      setIsEditing(true);
      showNotification("Please complete your profile to continue.", "info");
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        // Explicitly set all fields to ensure no undefined values (Controlled Inputs)
        profilePicture: user.profilePicture || '',
        profileImage: user.profileImage || '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '', // Critical: ensures value is '' not undefined
        address: user.address || '',
        nation: user.nation || '',
        gender: user.gender || 'male',
        language: user.language || 'english',
        profession: user.profession || '',
        experience: user.experience || '',
        specialization: user.specialization || '',
        barCouncilId: user.barCouncilId || '',
        universityName: user.universityName || '',
        yearOfStudy: user.yearOfStudy || '',
        studentId: user.studentId || '',
        dob: user.dob ? (typeof user.dob === 'string' ? user.dob : `${user.dob.year}-${user.dob.month}-${user.dob.day}`) : ''
      }));
    }
  }, [user, state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce Phone Number, especially for onboarding
    if (!formData.phone || formData.phone.trim() === '') {
      showNotification("Phone number is required to continue.", "error");
      return;
    }

    try {
      // Use the real updateProfile from context
      const result = await updateProfile(formData);

      if (result.success) {
        showNotification("Profile updated successfully!", "success");
        setIsEditing(false);

        // If coming from onboarding, redirect to dashboard/admin after save
        if (state?.onboarding) {
          setTimeout(() => {
            const targetRole = user?.role || formData.role;
            if (targetRole === 'admin') {
              navigate('/admin');
            } else {
              navigate('/login-redirect');
            }
          }, 1000);
        }
      } else {
        showNotification(result.message || "Failed to update profile.", "error");
      }
    } catch (error) {
      console.error("Update failed", error);
      showNotification("An unexpected error occurred.", "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("New passwords do not match!", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters.", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.status === 'success') {
        showNotification("Password updated successfully!", "success");
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };



  // --- Image Cropping State ---
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size too large (Max 5MB)", "error");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImage(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const uploadProcessedImage = async (blob) => {
    const imageFormData = new FormData();
    // Create a generic filename for the blob
    imageFormData.append('profileImage', blob, 'profile.jpg');

    try {
      showNotification("Uploading image...", "success");
      const response = await axios.post('/api/auth/upload-profile-image', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 'success') {
        const imageUrl = response.data.data.profilePicture;
        setFormData(prev => ({ ...prev, profileImage: imageUrl }));
        const updatedUser = { ...user, profilePicture: imageUrl };
        updateUserState(updatedUser);
        showNotification("Profile image uploaded successfully!", "success");
        setShowCropper(false);
        setCropImage(null);
      }
    } catch (error) {
      console.error("Upload failed", error);
      showNotification(error.response?.data?.message || "Failed to upload image.", "error");
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      await uploadProcessedImage(croppedImageBlob);
    } catch (e) {
      console.error(e);
      showNotification("Could not crop image", "error");
    }
  };

  const handleSkipCrop = async () => {
    // Convert base64 data URL to blob to upload as original
    const res = await fetch(cropImage);
    const blob = await res.blob();
    await uploadProcessedImage(blob);
  };

  // --- Delete Confirmation State ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteProfileImage = async () => {
    // Replaced window.confirm with custom modal trigger
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete('/api/auth/delete-profile-image');

      setFormData(prev => ({ ...prev, profileImage: '', profilePicture: '' })); // clear local

      // clear global
      const updatedUser = { ...user };
      delete updatedUser.profilePicture;
      delete updatedUser.profileImage;
      updateUserState(updatedUser);

      showNotification("Profile picture removed.", "success");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete failed", error);
      showNotification("Failed to delete profile picture.", "error");
      setShowDeleteConfirm(false);
    }
  };


  if (authLoading || (loadingStats && !user)) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <FaRobot size={40} className="fa-spin" style={{ color: 'var(--primary)' }} />
      </Container>
    );
  }

  return (
    <Container>
      <Notification $show={notification.show} $type={notification.type}>
        {notification.type === 'success' ? '✅' : '⚠️'} {notification.message}
      </Notification>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <CropperContainer>
          <div style={{ background: 'var(--bg-panel)', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', border: 'none', padding: 0 }}>Delete Profile Picture?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to remove your profile photo? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <ControlBtn onClick={() => setShowDeleteConfirm(false)}>Cancel</ControlBtn>
              <ControlBtn style={{ background: '#ff4d4d', color: 'white', border: 'none' }} onClick={confirmDelete}>Delete</ControlBtn>
            </div>
          </div>
        </CropperContainer>
      )}




      {showCropper && (
        <CropperContainer>
          <div style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>Crop Profile Picture</div>
          <CropperWrapper>
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </CropperWrapper>
          <CropperControls>
            <ControlBtn onClick={() => setShowCropper(false)}>Cancel</ControlBtn>
            <ControlBtn onClick={handleSkipCrop}>Ukip (Save Original)</ControlBtn>
            <ControlBtn $primary onClick={handleCropSave}>Crop & Save</ControlBtn>
          </CropperControls>
        </CropperContainer>
      )}

      <ProfileHeader>
        <AvatarWrapper>
          <Avatar>
            <UserAvatar 
              src={formData.profilePicture || formData.profileImage} 
              name={formData.name || user?.name} 
              size="160px" 
            />
          </Avatar>

          {/* Delete Button - Only show if image exists */}
          {isEditing && (formData.profilePicture || formData.profileImage) && (
            <div
              onClick={handleDeleteProfileImage}
              title="Remove Profile Picture"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#ff4d4d',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2
              }}
            >
              <FaXmark size={14} />
            </div>
          )}

          {isEditing && (
            <EditAvatarBtn>
              <FaCamera />
              {/* Connected input to handleFileSelect not direct upload */}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
            </EditAvatarBtn>
          )}
        </AvatarWrapper>

        <HeaderInfo>
          <div className="name-row">
            <h1>{formData.name || 'User'}</h1>
            <div className="badges">
              <span className="badge">{user?.role?.replace('_', ' ')}</span>
              {formData.specialization && <span className="badge">{formData.specialization}</span>}
            </div>
          </div>
          
          <div className="email-row">
            <FaEnvelope size={14} /> {formData.email}
          </div>

          <div className="meta-grid">
            <div className="meta-item">
              <FaCalendarDays /> 
              Member Since 
              <strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024'}</strong>
            </div>
            <div className="meta-item">
              <FaClock /> 
              Last Activity 
              <strong>{stats?.user?.lastLogin ? new Date(stats.user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now'}</strong>
            </div>
          </div>
        </HeaderInfo>

        <Actions>
          {!isEditing ? (
            <>
              <ActionBtn $variant="primary" onClick={() => setIsEditing(true)}>
                <FaUser /> Edit Profile
              </ActionBtn>
              <ActionBtn onClick={() => setShowPasswordModal(true)}>
                <FaKey /> Change Password
              </ActionBtn>
              <ActionBtn $variant="danger" onClick={handleLogout}>
                <FaRightFromBracket /> Sign Out
              </ActionBtn>
            </>
          ) : (
             <ActionBtn $variant="primary" onClick={() => document.getElementById('profile-form').requestSubmit()}>
               Save Profile
             </ActionBtn>
          )}
        </Actions>
      </ProfileHeader>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <FaChartSimple color="var(--primary)" /> Activity Statistics
        </h3>
        <StatsGrid>
            {user?.role === 'lawyer' ? (
                <>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.blogCount || 0}</span>
                        <span className="label">Blogs Written</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.blogViews || 0}</span>
                        <span className="label">Total Views</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.strategyUsage || 0}</span>
                        <span className="label">Strategies</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">AI</span>
                        <span className="label">Court Ready</span>
                    </StatCard>
                </>
            ) : user?.role === 'law_student' ? (
                <>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.completedMoots || 0}</span>
                        <span className="label">Moot Trials</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.averageMootScore || 0}/10</span>
                        <span className="label">Avg Score</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.strategyUsage || 0}</span>
                        <span className="label">Strategies</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">95%</span>
                        <span className="label">Readiness</span>
                    </StatCard>
                </>
            ) : (
                <>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.aiHelpUsage || 0}</span>
                        <span className="label">AI Queries</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">{stats?.roleStats?.docAnalyticCount || 0}</span>
                        <span className="label">Doc Analyses</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">SEC</span>
                        <span className="label">Data Safety</span>
                    </StatCard>
                    <StatCard>
                        <span className="value">100%</span>
                        <span className="label">Privacy</span>
                    </StatCard>
                </>
            )}
        </StatsGrid>
      </div>

      <MainLayout>
        <StyledFormSection style={{ marginTop: 0 }}>
          <h3><FaShieldHalved /> Personal Profile</h3>
          <form id="profile-form" onSubmit={handleSubmit}>
          {/* Main profile grid - adjusted gap for better spacing */}
          <Grid style={{ gap: '1.5rem' }}>
            <InputGroup>
              <label><FaUser /> Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
            </InputGroup>

            <InputGroup>
              <label><FaEnvelope /> Email</label>
              <input name="email" value={formData.email} disabled style={{ opacity: 0.6 }} />
            </InputGroup>

            <InputGroup>
              <label><FaPhone /> Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
            </InputGroup>

            <InputGroup>
              <label><FaLocationDot /> Address</label>
              <input name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} />
            </InputGroup>

            <InputGroup>
              <label><FaGlobe /> Nation</label>
              <input name="nation" value={formData.nation} onChange={handleChange} disabled={!isEditing} />
            </InputGroup>

            <InputGroup>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </InputGroup>

            <InputGroup>
              <label>Language</label>
              <select name="language" value={formData.language} onChange={handleChange} disabled={!isEditing}>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="gujarati">Gujarati</option>
              </select>
            </InputGroup>

            <InputGroup>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing} />
            </InputGroup>
          </Grid>

          {/* Conditional Fields based on Role/Profession */}
          {(user?.role === 'lawyer' || formData.profession === 'lawyer') && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h3 style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>Professional Details</h3>
              <Grid style={{ gap: '1.5rem' }}>
                <InputGroup>
                  <label><FaBriefcase /> Experience (Years)</label>
                  <input name="experience" value={formData.experience} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
                <InputGroup>
                  <label>Specialization</label>
                  <input name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
                <InputGroup>
                  <label>Bar Council ID</label>
                  <input name="barCouncilId" value={formData.barCouncilId} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
              </Grid>
            </div>
          )}

          {(user?.role === 'student' || user?.role === 'law_student' || formData.profession === 'law_student') && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <h3 style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>Education Details</h3>
              <Grid style={{ gap: '1.5rem' }}>
                <InputGroup>
                  <label><FaGraduationCap /> University</label>
                  <input name="universityName" value={formData.universityName} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
                <InputGroup>
                  <label>Year of Study</label>
                  <input name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
                <InputGroup>
                  <label>Student ID</label>
                  <input name="studentId" value={formData.studentId} onChange={handleChange} disabled={!isEditing} />
                </InputGroup>
              </Grid>
            </div>
          )}
        </form>
      </StyledFormSection>

      </MainLayout>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ModalOverlay onClick={() => setShowPasswordModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <p className="modal-desc">Ensure your account remains secure by using a strong password.</p>
            
            <form onSubmit={handlePasswordUpdate}>
              <Grid style={{ gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                <InputGroup>
                  <label><FaKey /> Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </InputGroup>

                <InputGroup>
                  <label><FaKey /> New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Minimum 6 characters"
                  />
                </InputGroup>

                <InputGroup>
                  <label><FaKey /> Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Repeat new password"
                  />
                </InputGroup>
              </Grid>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <ControlBtn type="button" style={{ flex: 1 }} onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </ControlBtn>
                <ControlBtn type="submit" $primary style={{ flex: 1 }} disabled={passwordLoading}>
                  {passwordLoading ? <FaRobot className="fa-spin" /> : 'Update Password'}
                </ControlBtn>
              </div>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
);
};

export default ProfilePage;
