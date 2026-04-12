import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaScaleBalanced, FaGavel, FaLightbulb, FaBrain, FaCircleInfo, FaArrowRight, FaClock, FaLocationDot } from 'react-icons/fa6';
import api from '../../../utils/axios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  width: 100%;
  padding: 3rem 2rem;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }
  p { color: var(--text-secondary); font-size: 1.1rem; }
`;

const PredictorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 28px;
  backdrop-filter: blur(10px);
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

const PredictBtn = styled.button`
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
  margin-top: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(108, 93, 211, 0.3);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PredictionCard = styled.div`
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.15) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(108, 93, 211, 0.3);
  padding: 2.5rem;
  border-radius: 28px;
  position: relative;
  overflow: hidden;

  h2 { font-size: 2.2rem; color: #fff; margin-bottom: 0.5rem; }
  .probability { color: var(--primary); font-weight: 800; font-size: 1.5rem; margin-bottom: 2rem; display: block; }
`;

const ProbabilityBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-top: 1.5rem;
  overflow: hidden;

  div {
    height: 100%;
    background: linear-gradient(90deg, var(--primary) 0%, #a29bfe 100%);
    width: ${props => props.$percent}%;
    transition: width 1.5s cubic-bezier(0.1, 0.7, 1.0, 0.1);
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 24px;
`;

const ScenarioBox = styled.div`
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border-left: 4px solid var(--primary);
  margin-bottom: 1rem;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  .desc { font-size: 0.9rem; color: var(--text-secondary); }
`;

const PastCaseItem = styled.div`
  padding: 1.2rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  
  h4 { color: #fff; margin-bottom: 0.4rem; font-size: 1rem; }
  p { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.4; }
`;

const LoadingOverlay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 400px;
    color: white;
    text-align: center;
`;

const SpinningBrain = styled(FaBrain)`
    color: var(--primary);
    font-size: 60px;
    animation: ${spin} 4s linear infinite;
`;

const CasePredictor = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        caseType: 'Criminal',
        description: '',
        evidence: '',
        ipcSections: '',
        jurisdiction: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await api.post('/api/predict/predict', formData);
            setResult(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate prediction. Try simplifying the description.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <h1>Case Outcome Predictor</h1>
                <p>AI-driven legal probability analysis for Indian Law.</p>
            </Header>

            <PredictorGrid>
                <FormSection>
                    <form onSubmit={handlePredict}>
                        <FormGroup>
                            <label>Case Classification</label>
                            <select name="caseType" value={formData.caseType} onChange={handleChange}>
                                <option value="Criminal">Criminal Case</option>
                                <option value="Civil">Civil Case</option>
                                <option value="Constitutional">Constitutional Case</option>
                                <option value="Corporate">Corporate Case</option>
                                <option value="Family">Family/Personal Case</option>
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <label>Jurisdiction (Court/Location)</label>
                            <input
                                name="jurisdiction"
                                placeholder="e.g. Bombay High Court, District Court Delhi"
                                value={formData.jurisdiction}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Situation Description</label>
                            <textarea
                                name="description"
                                required
                                placeholder="Describe the core events and details of the case..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Key Evidence Details</label>
                            <textarea
                                name="evidence"
                                placeholder="List physical evidence, witnesses, documents..."
                                style={{ minHeight: '80px' }}
                                value={formData.evidence}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Relevant Sections if known (comma separated)</label>
                            <input
                                name="ipcSections"
                                placeholder="e.g. IPC 302, Article 19"
                                value={formData.ipcSections}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        {error && (
                            <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        <PredictBtn type="submit" disabled={loading}>
                            {loading ? 'Analyzing Legal Data...' : 'Generate Prediction'}
                            {!loading && <FaGavel />}
                        </PredictBtn>
                    </form>
                </FormSection>

                <ResultsSection>
                    {loading && (
                        <LoadingOverlay>
                            <SpinningBrain />
                            <h3>Gemini AI is scanning laws and precedents...</h3>
                        </LoadingOverlay>
                    )}

                    {!loading && result && (
                        <>
                            <PredictionCard>
                                <h2>{result.prediction}</h2>
                                <span className="probability">Prediction Confidence: {result.probability}%</span>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.reasoning}</p>
                                <ProbabilityBar $percent={result.probability}>
                                    <div />
                                </ProbabilityBar>
                            </PredictionCard>

                            <InfoCard>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                    <FaClock /> Possible Scenarios
                                </h3>
                                {result.possibleOutcomes.map((v, i) => (
                                    <ScenarioBox key={i}>
                                        <div className="header">
                                            <span>{v.scenario}</span>
                                            <span style={{ color: 'var(--primary)' }}>{v.likelihood}</span>
                                        </div>
                                        <div className="desc">{v.description}</div>
                                    </ScenarioBox>
                                ))}
                            </InfoCard>

                            <InfoCard>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: '#ff7675' }}>
                                    <FaGavel /> Legal Consequences
                                </h3>
                                <ul style={{ marginLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                                    {result.legalConsequences.map((c, i) => <li key={i} style={{ marginBottom: '0.6rem' }}>{c}</li>)}
                                </ul>
                            </InfoCard>

                            <InfoCard>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: '#55efc4' }}>
                                    <FaScaleBalanced /> Landmark Precedents
                                </h3>
                                {result.suggestedPastCases.map((p, i) => (
                                    <PastCaseItem key={i}>
                                        <h4>{p.title}</h4>
                                        <p>{p.relevance}</p>
                                    </PastCaseItem>
                                ))}
                            </InfoCard>

                            <p style={{ fontSize: '0.75rem', opacity: 0.4, fontStyle: 'italic', textAlign: 'center' }}>{result.disclaimer}</p>
                        </>
                    )}

                    {!loading && !result && (
                        <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '28px' }}>
                            <FaLightbulb size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3>Ready to Predict</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Fill out the form to see AI-powered legal outcomes.</p>
                        </div>
                    )}
                </ResultsSection>
            </PredictorGrid>
        </Container>
    );
};

export default CasePredictor;
