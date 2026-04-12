import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaComment, FaCalendar, FaBuilding, FaGavel, FaLightbulb, FaUser, FaQuoteLeft, FaPaperPlane, FaArrowLeft, FaTags, FaCircleInfo, FaArrowRight, FaBrain, FaScaleBalanced } from 'react-icons/fa6';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import UserAvatar from '../../../components/Common/UserAvatar';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const CaseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  color: var(--text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1rem;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--primary);
  margin-bottom: 1.2rem;
  font-size: 1.3rem;

  svg { color: var(--primary); }
`;

const TextContent = styled.div`
  color: var(--text-main);
  line-height: 1.8;
  font-size: 1.05rem;
  white-space: pre-line;
`;

const AISection = styled(Card)`
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(108, 93, 211, 0.2);
`;

const ArgumentItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;

  svg { min-width: 18px; margin-top: 4px; color: var(--text-secondary); }
  p { color: var(--text-secondary); font-size: 0.95rem; }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionBtn = styled.button`
  background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.$active ? 'var(--primary-hover)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const CommentSection = styled.div`
  margin-top: 3rem;
  h2 { margin-bottom: 1.5rem; font-size: 1.8rem; }
`;

const CommentInput = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  textarea {
    flex: 1;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 12px;
    color: white;
    resize: none;
    height: 60px;
    transition: all 0.3s;

    &:focus { outline: none; border-color: var(--primary); }
  }

  button {
    background: var(--primary);
    border: none;
    border-radius: 12px;
    width: 60px;
    color: white;
    cursor: pointer;
    transition: all 0.3s;

    &:hover { background: var(--primary-hover); transform: scale(1.05); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentCard = styled.div`
  display: flex;
  gap: 1rem;

  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .content-wrap {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    padding: 1.2rem;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.05);

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      .name { font-weight: 700; font-size: 0.95rem; }
      .date { color: var(--text-secondary); font-size: 0.8rem; }
    }
    .text { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }
  }
`;

const SectionBadge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  display: inline-block;
  margin-right: 0.8rem;
  color: #fff;
`;

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/cases/${id}`);
      setCaseData(response.data.data);
    } catch (err) {
      console.error("Fetch case error:", err);
      navigate('/dashboard/case-library');
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    try {
      const res = await api.post(`/api/cases/${id}/star`);
      setCaseData({ ...caseData, stars: res.data.data });
    } catch (err) {
      console.error("Star error:", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/api/cases/${id}/comment`, { content: comment });
      setCaseData({
        ...caseData,
        comments: [...caseData.comments, res.data.data]
      });
      setComment('');
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container>Loading case details...</Container>;
  if (!caseData) return <Container>Case not found.</Container>;

  const isStarred = caseData.stars.includes(user?._id || user?.id);

  return (
    <Container>
      <BackBtn onClick={() => navigate('/dashboard/case-library')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}>
        <FaArrowLeft /> Exit Library
      </BackBtn>

      <ContentGrid>
        <MainContent>
          <div>
            <CaseBadge style={{ marginBottom: '1rem', display: 'inline-block', background: 'rgba(108, 93, 211, 0.15)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
              {caseData.legalTopic}
            </CaseBadge>
            <Title>{caseData.title}</Title>
            <CaseMeta>
              <span><FaCalendar /> {caseData.year}</span>
              <span><FaBuilding /> {caseData.court}</span>
              <span><FaUser /> Shared by {caseData.uploader.name}</span>
            </CaseMeta>
          </div>

          <AISection>
            <SectionTitle><FaBrain /> AI Summary & Insight</SectionTitle>
            <TextContent style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              {caseData.aiSummary || "No AI summary available."}
            </TextContent>
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#fff' }}>Key Legal Principles:</h4>
              {caseData.importantPrinciples?.map((principle, idx) => (
                <SectionBadge key={idx}><FaLightbulb size={12} style={{ marginRight: '6px' }} /> {principle}</SectionBadge>
              ))}
            </div>
          </AISection>

          <Card>
            <SectionTitle><FaCircleInfo /> Case Background & Facts</SectionTitle>
            <TextContent>{caseData.summary}</TextContent>
          </Card>

          <Card>
            <SectionTitle><FaGavel /> Judgement Outcome</SectionTitle>
            <TextContent>{caseData.judgementOutcome}</TextContent>
          </Card>

          {caseData.impact && (
            <Card>
              <SectionTitle><FaLightbulb /> Impact of the Case</SectionTitle>
              <TextContent>{caseData.impact}</TextContent>
            </Card>
          )}

          {caseData.source && (
            <Card>
              <SectionTitle><FaCircleInfo /> Source / Citation</SectionTitle>
              <TextContent style={{ fontFamily: 'monospace', color: 'var(--primary)', background: 'rgba(108, 93, 211, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                {caseData.source}
              </TextContent>
            </Card>
          )}

          <CommentSection>
            <h2>Community Insights ({caseData.comments.length})</h2>
            <CommentInput>
              <textarea
                placeholder="Add your perspective or a legal reference..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleComment} disabled={submitting}>
                <FaPaperPlane />
              </button>
            </CommentInput>

            <CommentList>
              {caseData.comments.map((c, i) => (
                <CommentCard key={i}>
                  <div className="avatar">
                    <UserAvatar 
                      src={c.user.profilePicture} 
                      name={c.user.name} 
                      size="45px" 
                    />
                  </div>
                  <div className="content-wrap">
                    <div className="header">
                      <span className="name">{c.user.name} <small style={{ fontWeight: 400, opacity: 0.6, marginLeft: '5px' }}>({c.user.role})</small></span>
                      <span className="date">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text">{c.content}</div>
                  </div>
                </CommentCard>
              ))}
            </CommentList>
          </CommentSection>
        </MainContent>

        <Sidebar>
          <Card>
            <SectionTitle><FaScaleBalanced /> Relevant Sections</SectionTitle>
            {caseData.ipcSections.map((sec, i) => (
              <SectionBadge key={i} style={{ width: '100%', marginBottom: '8px' }}>{sec}</SectionBadge>
            ))}
          </Card>

          <Card>
            <SectionTitle><FaQuoteLeft /> Key Arguments</SectionTitle>
            {caseData.keyArguments.map((arg, i) => (
              <ArgumentItem key={i}>
                <FaArrowRight size={14} />
                <p>{arg}</p>
              </ArgumentItem>
            ))}
          </Card>

          <Card>
            <SectionTitle><FaTags /> Topic Tags</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {caseData.tags.map((tag, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>#{tag}</span>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle><FaCircleInfo /> Suggested References</SectionTitle>
            {caseData.suggestedReferences?.map((ref, i) => (
              <div key={i} style={{ padding: '0.8rem', background: 'rgba(108, 93, 211, 0.05)', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {ref}
              </div>
            ))}
          </Card>

          <ActionButtons>
            <ActionBtn onClick={handleStar} $active={isStarred}>
              <FaStar color={isStarred ? '#fabb18' : '#fff'} />
              {isStarred ? 'Starred' : 'Star Useful'}
            </ActionBtn>
          </ActionButtons>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

// Generic BackBtn used above - declared for consistency
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

const CaseBadge = styled.span``; // Generic usage

export default CaseDetails;
