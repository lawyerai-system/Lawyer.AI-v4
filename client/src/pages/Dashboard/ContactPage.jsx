import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaSpinner, FaEnvelope, FaPhone, FaLocationDot, FaCircleCheck, FaUserTag, FaCircleInfo } from 'react-icons/fa6';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import AIModel from '../../components/Landing/AIModel';
import { toast } from 'react-hot-toast';

const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
`;

const Container = styled.div`
  padding: 10rem 2rem 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Box = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  overflow: hidden;
  max-width: 1200px;
  width: 100%;
  display: flex;
  box-shadow: 0 40px 120px rgba(0,0,0,0.6);
  backdrop-filter: blur(30px);
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const InfoSide = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #6c5dd3 0%, #4a40a2 100%);
  padding: 5rem 4rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
  }

  h2 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 2rem;
    letter-spacing: -2px;
    line-height: 1.1;
  }
  
  p {
    font-size: 1.15rem;
    opacity: 0.85;
    line-height: 1.8;
    margin-bottom: 4rem;
    color: #e0e0ff;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
    font-weight: 500;

    svg { 
      background: rgba(255,255,255,0.15);
      padding: 12px;
      border-radius: 12px;
      width: 45px;
      height: 45px;
      color: #fff;
    }
  }
`;

const FormSide = styled.div`
  flex: 1.4;
  padding: 5rem;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    padding: 3rem;
  }
`;

const SuccessOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0b0d14;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem;
  z-index: 10;
  animation: ${slideUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  svg {
    font-size: 5rem;
    color: #19c37d;
    margin-bottom: 2rem;
  }

  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;
  }

  p {
    color: #a0a3bd;
    font-size: 1.1rem;
    max-width: 400px;
    margin-bottom: 2rem;
  }

  .btn-reset {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover { background: rgba(255,255,255,0.05); }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
  
  label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.8rem;
    color: #a0a3bd;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input, textarea, select {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 1.2rem;
    border-radius: 18px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #6c5dd3;
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 25px rgba(108, 93, 211, 0.2);
    }

    &::placeholder { color: rgba(255,255,255,0.2); }

    option {
        background: #1a1d24;
        color: white;
    }
  }

  textarea {
    resize: none;
    min-height: 140px;
  }
`;

const SubmitBtn = styled.button`
  background: #6c5dd3;
  color: white;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 18px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #5a4db8;
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(108, 93, 211, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ContactPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'civilian',
    subject: '',
    message: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Sync with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        role: user.role || prev.role
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking or Real API call
      // We'll use the existing contact controller but adapt to new fields if needed
      // For now, mapping subject to phone or issueType in existing model if necessary, 
      // but the request asked for specific fields in the UI.
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        issueType: formData.subject || 'General Inquiry',
        message: formData.message,
        phone: "9999999999" // Fallback since it's required in some versions of the backend model
      };

      await api.post('/api/contact/submit', payload);
      setSubmitted(true);
      toast.success("Message received by our legal team!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deliver message.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData(prev => ({ ...prev, subject: '', message: '' }));
  };

  return (
    <PageWrapper>
      <LandingNav />
      <FixedBackground>
        <AIModel />
      </FixedBackground>
      <ContentContainer>
        <Container>
          <Box>
            <InfoSide>
              <div>
                <h2>Get in Touch</h2>
                <p>Our legal experts and support staff are here to assist you with any inquiries regarding the platform or legal tools.</p>

                <div className="contact-item"><FaEnvelope /> hetbhalani44@gmail.com</div>
                <div className="contact-item"><FaPhone /> +91 79848 49841</div>
                <div className="contact-item"><FaLocationDot /> Ahmedabad & Pune, India</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#e0e0ff' }}>
                <FaCircleCheck color="#19c37d" />
                Response guaranteed within 24 hours.
              </div>
            </InfoSide>

            <FormSide>
              {submitted && (
                <SuccessOverlay>
                  <FaCircleCheck />
                  <h3>Successfully Sent!</h3>
                  <p>Your message has been delivered to the platform administrators. We will get back to you shortly.</p>
                  <button className="btn-reset" onClick={resetForm}>Send another message</button>
                </SuccessOverlay>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <FormGroup>
                    <label>Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="First and Last Name" required />
                  </FormGroup>
                  <FormGroup>
                    <label><FaUserTag size={12} /> User Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                      <option value="civilian">Civilian</option>
                      <option value="law_student">Law Student</option>
                      <option value="lawyer">Professional Lawyer</option>
                    </select>
                  </FormGroup>
                </div>

                <FormGroup>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                </FormGroup>

                <FormGroup>
                  <label><FaCircleInfo size={12} /> Issue Category</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} required>
                    <option value="" disabled>Select a category</option>
                    <option value="General Contact">General Contact</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Report User">Report User</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Detailed Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Describe your inquiry in detail..." />
                </FormGroup>

                <SubmitBtn type="submit" disabled={loading}>
                  {loading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
                  {loading ? 'Processing...' : 'Submit Inquiry'}
                </SubmitBtn>
              </form>
            </FormSide>
          </Box>
        </Container>
        <LandingFooter />
      </ContentContainer>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </PageWrapper>
  );
};

export default ContactPage;
