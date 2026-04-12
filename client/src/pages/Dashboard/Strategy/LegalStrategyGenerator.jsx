import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGavel, FaLightbulb, FaBook, FaHistory, FaArrowRight, FaBrain } from 'react-icons/fa';
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
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const InputSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  margin-bottom: 3rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  font-size: 1.1rem;
  resize: vertical;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(108, 93, 211, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6c5dd3 0%, #8f85f2 100%);
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(108, 93, 211, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  height: fit-content;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 1rem;
  }
`;

const StrategyItem = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    color: #fff;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 0.95rem;
  }
`;

const LawBadge = styled.div`
  background: rgba(108, 93, 211, 0.1);
  border: 1px solid rgba(108, 93, 211, 0.2);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;

  strong {
    color: var(--primary);
    display: block;
    margin-bottom: 0.3rem;
  }

  span {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
`;

const Spinner = styled(FaBrain)`
  font-size: 3rem;
  color: var(--primary);
  animation: ${spin} 2s linear infinite;
`;

const CaseOverviewCard = styled(ResultCard)`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
`;

const LegalStrategyGenerator = () => {
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!scenario.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/api/strategy/generate-strategy', { scenario });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Legal Strategy Generator</h1>
        <p>AI-driven strategic planning for your legal disputes based on Indian laws and precedents.</p>
      </Header>

      <InputSection>
        <TextArea
          placeholder="Describe your case scenario in detail (e.g., 'A neighbor is encroaching on my ancestral property by building a wall without permission...')"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />
        <ActionButton
          onClick={handleGenerate}
          disabled={loading || scenario.length < 10}
        >
          {loading ? 'Analyzing Scene...' : 'Generate Legal Strategy'}
          {!loading && <FaArrowRight />}
        </ActionButton>
        {error && (
          <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginTop: '1.5rem', fontSize: '0.95rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </InputSection>

      {loading && (
        <LoadingOverlay>
          <Spinner />
          <h3>Our AI is drafting your strategy...</h3>
          <p>Analyzing IPC sections, constitutional provisions, and past cases.</p>
        </LoadingOverlay>
      )}

      {result && (
        <ResultSection>
          <CaseOverviewCard>
            <h3><FaGavel /> Case Overview</h3>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>{result.caseOverview}</p>
          </CaseOverviewCard>

          <ResultCard>
            <h3><FaBook /> Relevant Laws & Acts</h3>
            {result.relevantLaws.map((law, i) => (
              <LawBadge key={i}>
                <strong>{law.section}</strong>
                <span>{law.description}</span>
              </LawBadge>
            ))}
          </ResultCard>

          <ResultCard>
            <h3><FaLightbulb /> Possible Legal Strategies</h3>
            {result.legalStrategies.map((strat, i) => (
              <StrategyItem key={i}>
                <h4>{strat.title}</h4>
                <p>{strat.approach}</p>
              </StrategyItem>
            ))}
          </ResultCard>

          <ResultCard>
            <h3><FaArrowRight /> Key Arguments</h3>
            {result.keyArguments.map((arg, i) => (
              <StrategyItem key={i}>
                <h4>{arg.point}</h4>
                <p>{arg.rationale}</p>
              </StrategyItem>
            ))}
          </ResultCard>

          <ResultCard>
            <h3><FaHistory /> Similar Precedent Cases</h3>
            {result.precedentCases.map((caseItem, i) => (
              <StrategyItem key={i}>
                <h4>{caseItem.caseName}</h4>
                <p>{caseItem.relevance}</p>
              </StrategyItem>
            ))}
          </ResultCard>
        </ResultSection>
      )}
    </Container>
  );
};

export default LegalStrategyGenerator;
