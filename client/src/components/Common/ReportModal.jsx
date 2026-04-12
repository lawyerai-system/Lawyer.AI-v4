import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaFlag, FaTimes } from 'react-icons/fa';
import api from '../../utils/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #1a1d24;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  animation: ${slideUp} 0.3s ease-out;
  position: relative;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #ff5630;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  &:hover { color: white; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-main);
  }

  select, textarea {
    background: #0f111a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.8rem;
    color: white;
    outline: none;
    font-family: inherit;

    &:focus { border-color: #ff5630; }
    
    option {
      background: #1a1d24;
      color: white;
    }
  }

  textarea {
    resize: none;
    height: 120px;
  }
`;

const SubmitButton = styled.button`
  background: #ff5630;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 86, 48, 0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ReportModal = ({ isOpen, onClose, targetId, targetName, reportType }) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error("Please select a reason");

    setLoading(true);
    try {
      await api.post('/api/contact/submit', {
        name: user?.name || 'Anonymous',
        email: user?.email || 'N/A',
        phone: user?.phone || 'N/A',
        role: user?.role || 'civilian',
        issueType: reportType === 'Blog' ? 'Report User' : 'Technical Issue',
        message: `[REPORT ON: ${targetName}] - Reason: ${reason}. Additional Details: ${description}`
      });
      toast.success("Support request submitted successfully.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <h2><FaFlag /> Report {reportType}</h2>
        <p>You are reporting: <strong>{targetName}</strong></p>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Why are you reporting this?</label>
            <select value={reason} onChange={e => setReason(e.target.value)} required>
              <option value="">Select a reason</option>
              {reportType === 'User' && (
                <>
                  <option value="Abusive behavior">Abusive behavior</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Spam">Spam</option>
                  <option value="Inappropriate Profile">Inappropriate Profile</option>
                </>
              )}
              {reportType === 'Blog' && (
                <>
                  <option value="Plagiarism">Plagiarism</option>
                  <option value="Misinformation">Misinformation</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Offensive Language">Offensive Language</option>
                </>
              )}
              {reportType === 'Legal Information' && (
                <>
                  <option value="Incorrect Law/Section">Incorrect Law/Section</option>
                  <option value="Misleading Advice">Misleading Advice</option>
                  <option value="Outdated Information">Outdated Information</option>
                </>
              )}
              <option value="Other">Other</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Additional Details (Optional)</label>
            <textarea 
              placeholder="Provide more context to help our moderators..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReportModal;
