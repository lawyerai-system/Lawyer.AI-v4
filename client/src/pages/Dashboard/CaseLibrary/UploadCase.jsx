import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCloudArrowUp, FaGavel, FaScaleBalanced, FaArrowLeft, FaBrain, FaFileLines, FaLink } from 'react-icons/fa6';
import api from '../../../utils/axios';
import toast from 'react-hot-toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 1rem;
  transition: color 0.3s;

  &:hover { color: white; }
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 24px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 2.5rem;
  background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.6rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(108, 93, 211, 0.1);
    }
  }

  textarea { min-height: 120px; resize: vertical; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #6c5dd3 0%, #8f85f2 100%);
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s;
  margin-top: 2rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(108, 93, 211, 0.3);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const LoadingOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    color: white;
    text-align: center;
`;

const BrainIcon = styled(FaBrain)`
    font-size: 4rem;
    color: var(--primary);
    animation: ${spin} 3s linear infinite;
`;

const UploadCase = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        year: new Date().getFullYear(),
        court: '',
        legalTopic: 'Criminal',
        ipcSections: '',
        summary: '',
        judgementOutcome: '',
        impact: '',
        source: '',
        tags: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const refinedData = {
                ...formData,
                ipcSections: formData.ipcSections.split(',').map(s => s.trim()).filter(s => s),
                tags: formData.tags.split(',').map(s => s.trim()).filter(s => s)
            };

            setError(null);
            const response = await api.post('/api/cases', refinedData);
            if (response.data.status === 'success') {
                toast.success('Case submitted successfully! It is now pending review.');
                navigate('/dashboard/case-library');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to upload case. Please check all fields.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            {loading && (
                <LoadingOverlay>
                    <BrainIcon />
                    <div>
                        <h2>Gemini AI is analyzing your case...</h2>
                        <p>Generating professional summary, legal principles, and tags.</p>
                    </div>
                </LoadingOverlay>
            )}

            <BackBtn onClick={() => navigate('/dashboard/case-library')}>
                <FaArrowLeft /> Back to Library
            </BackBtn>

            <FormCard>
                <Title>Share Legal Case</Title>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>Case Title</label>
                        <input
                            name="title"
                            required
                            placeholder="e.g. Navtej Singh Johar v. Union of India"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <Grid>
                        <FormGroup>
                            <label>Year of Judgement</label>
                            <input
                                type="number"
                                name="year"
                                required
                                value={formData.year}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <label>Legal Area</label>
                            <select name="legalTopic" value={formData.legalTopic} onChange={handleChange}>
                                <option value="Criminal">Criminal Law</option>
                                <option value="Civil">Civil Law</option>
                                <option value="Constitutional">Constitutional Law</option>
                                <option value="Corporate">Corporate Law</option>
                                <option value="Family">Family Law</option>
                                <option value="Property">Property Law</option>
                                <option value="Labor">Labor Law</option>
                                <option value="Environmental">Environmental Law</option>
                            </select>
                        </FormGroup>
                    </Grid>

                    <FormGroup>
                        <label>Court Name</label>
                        <input
                            name="court"
                            required
                            placeholder="e.g. Supreme Court of India"
                            value={formData.court}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Relevant IPC Sections / Acts (Comma separated)</label>
                        <input
                            name="ipcSections"
                            placeholder="e.g. Section 377, Section 14"
                            value={formData.ipcSections}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Case Summary (The story and context)</label>
                        <textarea
                            name="summary"
                            required
                            placeholder="Describe what happened in the case..."
                            value={formData.summary}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Judgment Summary</label>
                        <textarea
                            name="judgementOutcome"
                            required
                            placeholder="What did the court decide?"
                            value={formData.judgementOutcome}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Impact of the Case</label>
                        <textarea
                            name="impact"
                            placeholder="How did this case change the legal landscape?"
                            value={formData.impact}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Source or Reference</label>
                        <input
                            name="source"
                            placeholder="e.g. AIR 2018 SC 4321, or a website link"
                            value={formData.source}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Tags (Comma separated)</label>
                        <input
                            name="tags"
                            placeholder="e.g. privacy, lgbtq, fundamental rights"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    {error && (
                        <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    <SubmitBtn type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Share Case with Community'}
                        {!loading && <FaCloudArrowUp />}
                    </SubmitBtn>
                </form>
            </FormCard>
        </Container>
    );
};

export default UploadCase;
