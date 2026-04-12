import React, { useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/axios';
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaGavel,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const PageContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 3rem 2rem;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 5%;
    right: 5%;
    width: 300px;
    height: 300px;
    background: var(--primary);
    filter: blur(150px);
    opacity: 0.1;
    z-index: -1;
    border-radius: 50%;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  background: linear-gradient(135deg, #fff 0%, #a0e6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
`;

const UploadSection = styled.div`
  background: rgba(30, 30, 45, 0.4);
  backdrop-filter: blur(20px);
  border: 2px dashed ${props => props.$isDragging ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
  border-radius: 32px;
  padding: 5rem 2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(118, 75, 162, 0.05) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: var(--primary);
    background: rgba(30, 30, 45, 0.6);
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    
    &::after { opacity: 1; }
  }

  ${props => props.$isDragging && css`
    background: rgba(118, 75, 162, 0.1);
    transform: scale(1.02);
    border-style: solid;
  `}

  input {
    display: none;
  }
`;

const UploadIcon = styled(FaCloudUploadAlt)`
  font-size: 4rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(118, 75, 162, 0.4));
`;

const UploadText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const SupportedLabel = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const LoadingSection = styled.div`
  text-align: center;
  padding: 3rem;
  animation: ${fadeIn} 0.5s ease;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(118, 75, 162, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: ${spin} 1s linear infinite;
`;

const AnalysisResult = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const DocTypeBadge = styled.div`
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(30, 30, 45, 0.3);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  height: fit-content;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(30, 30, 45, 0.4);
    border-color: rgba(118, 75, 162, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #fff;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;

    svg {
      color: var(--primary);
    }
  }
`;

const ExplanationText = styled.p`
  line-height: 1.8;
  color: var(--text-main);
  font-size: 1.05rem;
`;

const ClauseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ClauseItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 1.2rem;
  border-radius: 16px;
  border-left: 4px solid var(--primary);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateX(5px);
  }

  h4 {
    margin-bottom: 0.5rem;
    color: #fff;
    font-size: 1.1rem;
  }

  p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
`;

const RiskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RiskItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$severity === 'High' ? 'rgba(245, 101, 101, 0.3)' : 'rgba(237, 137, 54, 0.3)'};

  .risk-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    strong { 
      color: ${props => props.$severity === 'High' ? '#f56565' : '#ed8936'};
      font-size: 0.95rem;
    }
    
    span {
      font-size: 0.75rem;
      background: ${props => props.$severity === 'High' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(237, 137, 54, 0.2)'};
      color: ${props => props.$severity === 'High' ? '#f56565' : '#ed8936'};
      padding: 0.1rem 0.5rem;
      border-radius: 4px;
      font-weight: bold;
    }
  }

  p {
    font-size: 0.85rem;
    color: var(--text-main);
  }
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: white;
  }
`;

const ErrorMsg = styled.div`
  background: rgba(245, 101, 101, 0.1);
  border: 1px solid rgba(245, 101, 101, 0.3);
  color: #f56565;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
`;

const DocumentAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = React.useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrop = React.useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleFileSelect = (selectedFile) => {
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload only PDF or TXT files.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    analyzeFile(selectedFile);
  };

  const analyzeFile = async (fileToAnalyze) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', fileToAnalyze);

    try {
      const res = await api.post('/api/document/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 'success') {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <PageContainer>
      <Header>
        <Title>Legal Document Analyzer</Title>
        <Subtitle>
          Simplify complex legal documents instantly. Upload your PDF or TXT files (FIR, Notices, Contracts)
          to receive a plain language explanation and risk assessment.
        </Subtitle>
      </Header>

      {!loading && !result && (
        <UploadSection
          $isDragging={isDragging}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          />
          <UploadIcon />
          <UploadText>
            {isDragging ? 'Drop your file here' : 'Drag & Drop or Click to Upload'}
          </UploadText>
          <SupportedLabel>Supports PDF and TXT (Max 5MB)</SupportedLabel>

          {error && (
            <ErrorMsg style={{ marginTop: '2rem', justifyContent: 'center' }}>
              <FaExclamationTriangle /> {error}
            </ErrorMsg>
          )}
        </UploadSection>
      )}

      {loading && (
        <LoadingSection>
          <Spinner />
          <UploadText>AI is Analyzing Your Document...</UploadText>
          <Subtitle>This shouldn't take long. We are extracting text and identifying key clauses.</Subtitle>
        </LoadingSection>
      )}

      {result && (
        <AnalysisResult>
          <ResultHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ResetButton onClick={reset}><FaTimes /> Analyze Another</ResetButton>
              <DocTypeBadge>{result.docType}</DocTypeBadge>
            </div>
            <Subtitle style={{ margin: 0 }}>Analysis Complete <FaCheckCircle color="var(--primary)" /></Subtitle>
          </ResultHeader>

          {error && <ErrorMsg><FaExclamationTriangle /> {error}</ErrorMsg>}

          <MainGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card>
                <h3><FaInfoCircle /> Simplified Explanation</h3>
                <ExplanationText>{result.simplifiedExplanation}</ExplanationText>
              </Card>

              <Card>
                <h3><FaFileAlt /> Important Clauses</h3>
                <ClauseList>
                  {result.importantClauses?.map((clause, idx) => (
                    <ClauseItem key={idx}>
                      <h4>{clause.title}</h4>
                      <p>{clause.description}</p>
                    </ClauseItem>
                  ))}
                </ClauseList>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <Card style={{ borderLeft: '4px solid #ed8936' }}>
                <h3><FaExclamationTriangle color="#ed8936" /> Legal Risks</h3>
                <RiskList>
                  {result.legalRisks?.map((risk, idx) => (
                    <RiskItem key={idx} $severity={risk.severity}>
                      <div className="risk-header">
                        <strong>{risk.severity} Severity</strong>
                        <span>RISK</span>
                      </div>
                      <p>{risk.risk}</p>
                    </RiskItem>
                  ))}
                  {(!result.legalRisks || result.legalRisks.length === 0) && (
                    <p style={{ color: 'var(--text-secondary)' }}>No major risks identified.</p>
                  )}
                </RiskList>
              </Card>

              <Card style={{ borderLeft: '4px solid var(--primary)' }}>
                <h3><FaGavel /> Relevant Sections</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.relevantSections?.map((sec, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                      <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.3rem' }}>{sec.section}</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sec.reason}</p>
                    </div>
                  ))}
                  {(!result.relevantSections || result.relevantSections.length === 0) && (
                    <p style={{ color: 'var(--text-secondary)' }}>No specific legal sections identified.</p>
                  )}
                </div>
              </Card>
            </div>
          </MainGrid>
        </AnalysisResult>
      )}
    </PageContainer>
  );
};

export default DocumentAnalyzer;
