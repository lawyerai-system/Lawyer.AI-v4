import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGavel, FaScaleBalanced, FaSection, FaArrowRight, FaPrint, FaArrowDown, FaScaleUnbalanced, FaBrain, FaFileLines, FaTrophy, FaLightbulb } from 'react-icons/fa6';
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;

  div {
    h1 {
      font-size: 3rem;
      background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    p { color: var(--text-secondary); font-size: 1.1rem; }
  }
`;

const SimulationLayout = styled.div`
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const InputSection = styled.div`
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

  input, textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s;

    &:focus { outline: none; border-color: var(--primary); }
  }

  textarea { min-height: 100px; resize: vertical; }
`;

const SimulateBtn = styled.button`
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

const ResultsView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AnalysisCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 28px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  svg { font-size: 1.6rem; }
`;

const IssueBox = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border-left: 4px solid var(--primary);
  margin-bottom: 1rem;

  h4 { font-size: 1.1rem; margin-bottom: 0.5rem; }
  p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
`;

const LegalRule = styled.div`
  padding: 1.2rem;
  background: rgba(108, 93, 211, 0.05);
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.95rem;

  .section { font-weight: 700; color: var(--primary); margin-bottom: 0.4rem; display: block; }
  .desc { color: var(--text-secondary); line-height: 1.4; }
`;

const EvaluationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;

const Evaluator = styled.div`
  padding: 1.5rem;
  border-radius: 20px;
  background: ${props => props.$type === 'pro' ? 'rgba(85, 239, 196, 0.03)' : 'rgba(255, 118, 117, 0.03)'};
  border: 1px solid ${props => props.$type === 'pro' ? 'rgba(85, 239, 196, 0.1)' : 'rgba(255, 118, 117, 0.1)'};

  h4 { margin-bottom: 1rem; color: ${props => props.$type === 'pro' ? '#55efc4' : '#ff7675'}; }

  ul {
    list-style: none;
    li {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.8rem;
      display: flex;
      gap: 0.6rem;
      svg { margin-top: 3px; font-size: 0.8rem; }
    }
  }
`;

const JudgementCard = styled(AnalysisCard)`
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 4px double rgba(108, 93, 211, 0.3);
  padding: 3rem;
  text-align: center;

  .final-order {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .reasoning {
    text-align: justify;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    white-space: pre-line;
  }
`;

const ExportBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  transition: 0.3s;

  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const SpinningBrain = styled(FaBrain)`
    color: var(--primary);
    font-size: 60px;
    animation: ${spin} 4s linear infinite;
`;

const CourtSimulation = () => {
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    description: '',
    prosecutorArguments: '',
    defenseArguments: '',
    evidence: '',
    laws: ''
  });

  const handleChange = (e) => setInputData({ ...inputData, [e.target.name]: e.target.value });

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/simulation/simulate', inputData);
      setSimResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const report = `AI COURT SIMULATION REPORT\n\n` +
      `CASE DESCRIPTION: ${inputData.description}\n\n` +
      `FINAL ORDER: ${simResult.simulatedJudgement.decision}\n\n` +
      `JUDICIAL REASONING:\n${simResult.simulatedJudgement.reasoning}\n\n` +
      `ISSUES IDENTIFIED:\n${simResult.issues.map(i => `- ${i.issue}: ${i.description}`).join('\n')}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Judgement_Simulation_${Date.now()}.txt`;
    a.click();
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>AI Court Simulation</h1>
          <p>Experience the judicial reasoning process through AI analysis.</p>
        </div>
        {simResult && (
          <ExportBtn onClick={handleExport}>
            <FaPrint /> Export Judgement
          </ExportBtn>
        )}
      </Header>

      <SimulationLayout>
        <InputSection>
          <form onSubmit={handleRunSimulation}>
            <FormGroup>
              <label>The Facts (Case Description)</label>
              <textarea name="description" required placeholder="What are the essential facts of the case?" value={inputData.description} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Petitioner's Case (Prosecutor)</label>
              <textarea name="prosecutorArguments" required placeholder="Key arguments presented against the respondent..." value={inputData.prosecutorArguments} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Respondent's Defense</label>
              <textarea name="defenseArguments" required placeholder="Key arguments presented in defense..." value={inputData.defenseArguments} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Evidence Summary</label>
              <textarea name="evidence" placeholder="List documents, witnesses, or forensic evidence..." style={{ minHeight: '80px' }} value={inputData.evidence} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <label>Mentioned Sections/Acts</label>
              <input name="laws" placeholder="e.g. IPC 377, CRPC 144, Art 21" value={inputData.laws} onChange={handleChange} />
            </FormGroup>

            {error && (
              <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <SimulateBtn type="submit" disabled={loading}>
              {loading ? 'Judge is Deliberating...' : 'Run Simulation'}
              {!loading && <FaGavel />}
            </SimulateBtn>
          </form>
        </InputSection>

        <ResultsView>
          {!simResult && !loading && (
            <div style={{ padding: '6rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '28px' }}>
              <FaScaleBalanced size={50} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
              <h3>Judicial Bench Ready</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Submit the arguments to start the AI judicial process.</p>
            </div>
          )}

          {loading && (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <SpinningBrain />
              <h3 style={{ marginTop: '2rem' }}>Reviewing Facts & Precedents...</h3>
              <p style={{ color: 'var(--text-secondary)' }}>The AI judge is constructing the legal rationale.</p>
            </div>
          )}

          {simResult && !loading && (
            <>
              <AnalysisCard>
                <SectionTitle><FaArrowDown /> Issue Identification</SectionTitle>
                {simResult.issues.map(i => (
                  <IssueBox key={i.id}>
                    <h4>Issue #{i.id}: {i.issue}</h4>
                    <p>{i.description}</p>
                  </IssueBox>
                ))}
              </AnalysisCard>

              <AnalysisCard>
                <SectionTitle><FaSection /> Legal Analysis</SectionTitle>
                {simResult.legalAnalysis.map((law, idx) => (
                  <LegalRule key={idx}>
                    <span className="section">{law.section}</span>
                    <p className="desc">{law.application}</p>
                  </LegalRule>
                ))}
              </AnalysisCard>

              <AnalysisCard>
                <SectionTitle><FaTrophy /> Argument Evaluation</SectionTitle>
                <EvaluationGrid>
                  <Evaluator $type="pro">
                    <h4>Prosecution Profile</h4>
                    <ul>{simResult.argumentEvaluation.prosecutor.strengths.map((s, idx) => <li key={idx}><FaScaleBalanced /> {s}</li>)}</ul>
                    <hr style={{ opacity: 0.1, margin: '1rem 0' }} />
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Weaknesses: {simResult.argumentEvaluation.prosecutor.weaknesses.join(", ")}</p>
                  </Evaluator>
                  <Evaluator $type="def">
                    <h4>Defense Profile</h4>
                    <ul>{simResult.argumentEvaluation.defense.strengths.map((s, idx) => <li key={idx}><FaArrowRight /> {s}</li>)}</ul>
                    <hr style={{ opacity: 0.1, margin: '1rem 0' }} />
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Weaknesses: {simResult.argumentEvaluation.defense.weaknesses.join(", ")}</p>
                  </Evaluator>
                </EvaluationGrid>
              </AnalysisCard>

              <JudgementCard>
                <SectionTitle style={{ justifyContent: 'center' }}><FaScaleUnbalanced /> Simulated Judgement</SectionTitle>
                <div className="final-order">ORDER: {simResult.simulatedJudgement.decision}</div>
                <div className="reasoning">{simResult.simulatedJudgement.reasoning}</div>
                {simResult.simulatedJudgement.directions && (
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'left' }}>
                    <strong style={{ color: 'var(--primary)' }}>Court Directions:</strong>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{simResult.simulatedJudgement.directions}</p>
                  </div>
                )}
              </JudgementCard>
            </>
          )}
        </ResultsView>
      </SimulationLayout>
    </Container>
  );
};

export default CourtSimulation;
