import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGavel, FaLightbulb, FaBook, FaArrowRight, FaBrain, FaFilePdf, FaListCheck, FaFolderOpen, FaScaleBalanced } from 'react-icons/fa6';
import api from '../../../utils/axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  width: 100%;
  padding: 3rem 2rem;
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
    max-width: 800px;
    margin: 0 auto;
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

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--primary);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
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
  background: ${props => props.$secondary ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, #6c5dd3 0%, #8f85f2 100%)'};
  color: white;
  border: ${props => props.$secondary ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  padding: 1rem 2rem;
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
    background: ${props => props.$secondary ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #7b6ae0 0%, #9d94f5 100%)'};
    box-shadow: ${props => props.$secondary ? 'none' : '0 10px 20px rgba(108, 93, 211, 0.3)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  border-radius: 24px;
  height: fit-content;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--primary);
    opacity: 0.5;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }
`;

const FullWidthCard = styled(ResultCard)`
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;

  svg {
    color: var(--primary);
    margin-top: 0.3rem;
    min-width: 14px;
  }

  .content {
    strong {
      display: block;
      color: white;
      margin-bottom: 0.2rem;
    }
    span {
      font-size: 0.95rem;
    }
  }
`;

const Disclaimer = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  background: rgba(255, 118, 117, 0.05);
  border: 1px solid rgba(255, 118, 117, 0.1);
  border-radius: 16px;
  text-align: center;
  color: #ff7675;
  font-size: 0.9rem;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem;
  text-align: center;

  h3 { color: white; font-size: 1.5rem; }
  p { color: var(--text-secondary); }
`;

const Spinner = styled(FaBrain)`
  font-size: 4rem;
  color: var(--primary);
  animation: ${spin} 2s linear infinite;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  gap: 1rem;
`;

const AICaseBuilder = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBuildCase = async () => {
    if (!description.trim() || description.length < 10) {
      toast.error('Please provide a more detailed description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/api/builder/build-case', { description });
      setResult(response.data.data);
      toast.success('Case analysis generated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate analysis. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(108, 93, 211);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Case Blueprint Report', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 70, 25);

      let yPos = 55;

      // Case Description
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Case Description', 20, yPos);
      yPos += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(description, pageWidth - 40);
      doc.text(descLines, 20, yPos);
      yPos += (descLines.length * 6) + 10;

      // Possible Legal Area
      if (yPos > 260) { doc.addPage(); yPos = 20; }
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Possible Legal Area', 20, yPos);
      yPos += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(result.legalArea || 'N/A', 20, yPos);
      yPos += 15;

      // Possible Legal Issues
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Possible Legal Issues', 20, yPos);
      yPos += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      (result.legalIssues || []).forEach(issue => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        doc.text(`• ${issue}`, 25, yPos);
        yPos += 7;
      });
      yPos += 10;

      // Relevant Laws Table
      if (yPos > 240) { doc.addPage(); yPos = 20; }
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Relevant Laws & Statutes', 20, yPos);
      yPos += 5;
      
      autoTable(doc, {
        startY: yPos,
        head: [['Statute/Section', 'Relevance']],
        body: (result.relevantLaws || []).map(law => [law.statute, law.relevance]),
        theme: 'striped',
        headStyles: { fillColor: [108, 93, 211] },
        margin: { left: 20, right: 20 }
      });
      
      yPos = doc.lastAutoTable.finalY + 15;

      // Possible Legal Steps
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Possible Legal Steps', 20, yPos);
      yPos += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      (result.legalSteps || []).forEach(step => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        doc.text(`• ${step}`, 25, yPos);
        yPos += 7;
      });
      yPos += 10;

      // Recommended Evidence
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setTextColor(108, 93, 211);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommended Evidence', 20, yPos);
      yPos += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      (result.recommendedEvidence || []).forEach(item => {
        if (yPos > 280) { doc.addPage(); yPos = 20; }
        doc.text(`• ${item}`, 25, yPos);
        yPos += 7;
      });

      // Disclaimer
      doc.addPage();
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DISCLAIMER', pageWidth / 2, 40, { align: 'center' });
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const disclaimer = "This report is generated by Artificial Intelligence and is for informational purposes only. It DOES NOT constitute legal advice. Lawyer.AI and its affiliates are not responsible for any actions taken based on this report. Always consult with a qualified legal professional for your specific case.";
      doc.text(doc.splitTextToSize(disclaimer, pageWidth - 40), 20, 55);

      doc.save('Case_Blueprint_Report.pdf');
      toast.success('PDF report downloaded!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast.error('Failed to export PDF: ' + err.message);
    }
  };

  return (
    <Container>
      <Header>
        <h1>AI Case Builder</h1>
        <p>Convert your legal problems into structured legal analysis. Identify issues, relevant laws, and next steps in seconds.</p>
      </Header>

      <InputSection>
        <Label>Describe your legal problem</Label>
        <TextArea
          placeholder="Example: My landlord refuses to return my security deposit of ₹50,000 even after I vacated the premises in good condition and served the required notice period..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ActionButton 
          onClick={handleBuildCase}
          disabled={loading || description.length < 10}
        >
          {loading ? 'Analyzing Problem...' : 'Build My Case'}
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
          <h3>Converting your problem into a legal case...</h3>
          <p>Analyzing statutes, identifying legal issues, and drafting your roadmap.</p>
        </LoadingOverlay>
      )}

      {result && (
        <>
          <ResultSection>
            <FullWidthCard>
              <h3><FaFolderOpen /> Possible Legal Area</h3>
              <p style={{ fontSize: '1.2rem', color: 'white' }}>{result.legalArea}</p>
            </FullWidthCard>

            <ResultCard>
              <h3><FaListCheck /> Possible Legal Issues</h3>
              <List>
                {result.legalIssues.map((issue, i) => (
                  <ListItem key={i}>
                    <FaArrowRight size={12} />
                    <div className="content"><span>{issue}</span></div>
                  </ListItem>
                ))}
              </List>
            </ResultCard>

            <ResultCard>
              <h3><FaBook /> Relevant Laws & Statutes</h3>
              <List>
                {result.relevantLaws.map((law, i) => (
                  <ListItem key={i}>
                    <FaScaleBalanced size={14} />
                    <div className="content">
                      <strong>{law.statute}</strong>
                      <span>{law.relevance}</span>
                    </div>
                  </ListItem>
                ))}
              </List>
            </ResultCard>

            <ResultCard>
              <h3><FaGavel /> Possible Legal Steps</h3>
              <List>
                {result.legalSteps.map((step, i) => (
                  <ListItem key={i}>
                    <FaArrowRight size={12} />
                    <div className="content"><span>{step}</span></div>
                  </ListItem>
                ))}
              </List>
            </ResultCard>

            <ResultCard>
              <h3><FaLightbulb /> Recommended Evidence</h3>
              <List>
                {result.recommendedEvidence.map((item, i) => (
                  <ListItem key={i}>
                    <FaArrowRight size={12} />
                    <div className="content"><span>{item}</span></div>
                  </ListItem>
                ))}
              </List>
            </ResultCard>
          </ResultSection>

          <Controls>
            <ActionButton $secondary onClick={() => {setResult(null); setDescription('');}}>
              Start New Analysis
            </ActionButton>
            <ActionButton onClick={handleDownloadPDF}>
              <FaFilePdf /> Download Case Report
            </ActionButton>
          </Controls>

          <Disclaimer>
            <strong>Legal Disclaimer</strong>
            The analysis provided above is generated by AI for informational purposes only and does not constitute formal legal advice. 
            The Indian legal system is complex and varies by jurisdiction. Always consult with a licensed advocate 
            before taking any legal action or making decisions based on this information.
          </Disclaimer>
        </>
      )}
    </Container>
  );
};

export default AICaseBuilder;
