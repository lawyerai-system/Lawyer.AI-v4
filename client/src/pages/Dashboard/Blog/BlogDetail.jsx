import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/axios';
import { FaArrowLeft, FaUser, FaCalendar, FaTag, FaTrash, FaPen, FaFlag } from 'react-icons/fa6';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import { useAuth } from '../../../context/AuthContext';
import ReportModal from '../../../components/Common/ReportModal';
import UserAvatar from '../../../components/Common/UserAvatar';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
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
  
  &:hover { color: var(--primary); }
`;

const ArticleHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 2rem;
`;

const CategoryTag = styled.span`
  background: rgba(25, 195, 125, 0.15);
  color: var(--primary);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 2rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-main);
  white-space: pre-wrap;
  margin-bottom: 4rem;
`;

const SummaryBox = styled.div`
  background: linear-gradient(135deg, rgba(25, 195, 125, 0.1) 0%, rgba(160, 230, 255, 0.1) 100%);
  border: 1px solid rgba(25, 195, 125, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: 'AI Summary';
    position: absolute;
    top: 0;
    right: 0;
    background: var(--primary);
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.8rem;
    border-bottom-left-radius: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  p {
    font-style: italic;
    color: var(--text-main);
    font-size: 1.05rem;
    margin: 0;
    line-height: 1.6;
  }
`;

const RelatedSection = styled.div`
  margin-top: 5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 3rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const MiniCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-3px);
    border-color: var(--primary);
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: white;
  }

  p {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CommentSection = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 2rem;
  border-radius: 12px;
  margin-top: 4rem;
`;

const CommentInput = styled.div`
  margin-bottom: 2rem;
  
  textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 1rem;
    color: white;
    min-height: 100px;
    margin-bottom: 1rem;
    resize: vertical;
    
    &:focus { outline: none; border-color: var(--primary); }
  }

  button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    
    &:disabled { opacity: 0.6; cursor: default; }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 1.5rem;

  &:last-child { border-bottom: none; }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const CommentContent = styled.div`
  flex: 1;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    strong { color: white; }
    span { font-size: 0.85rem; color: var(--text-secondary); }
  }

  p {
    color: var(--text-main);
    line-height: 1.5;
  }
`;

const DeleteBtn = styled.button`
    background: transparent;
    border: none;
    color: #ff4d4d;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
    
    &:hover { opacity: 0.8; }
`;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/blogs/${id}`);
      if (res.data.status === 'success') {
        setPost(res.data.data);

        // Fetch related posts
        const relatedRes = await api.get(`/api/blogs/${id}/related`);
        if (relatedRes.data.status === 'success') {
          setRelated(relatedRes.data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load post", error);
      if (error.response?.status === 404) navigate('/dashboard/blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/api/blogs/${id}/comments`, { content: comment });
      setComment('');
      setError(null);
      fetchPost(); // Refresh comments
    } catch (err) {
      console.error("Comment failed", err);
      setError("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/blogs/${id}`);
      navigate('/dashboard/blog');
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete post");
    }
  };

  // Removed local DeleteModal component

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!post) return null;

  return (
    <PageContainer>
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Article?"
        message={`Are you sure you want to delete "${post.title}"?`}
        type="danger"
      />
      <BackBtn onClick={() => navigate('/dashboard/blog')}>
        <FaArrowLeft /> Back to Articles
      </BackBtn>

      <ArticleHeader>
        {post.image && !post.image.includes('default-blog.jpg') && (
          <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={post.image.startsWith('http') ? post.image : post.image}
              alt={post.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        )}
        <CategoryTag>{post.category}</CategoryTag>
        <Title>{post.title}</Title>
        <MetaInfo>
          <div style={{ gap: '0.8rem' }}>
            <UserAvatar src={post.author?.profilePicture} name={post.author?.name} size="24px" />
            {post.author?.name}
          </div>
          <div><FaCalendar /> {new Date(post.createdAt).toLocaleDateString()}</div>
        </MetaInfo>

        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {(user?.role === 'admin' || (user?.role === 'lawyer' && user?.id === post.author?._id)) && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <DeleteBtn as="button" onClick={() => navigate(`/dashboard/blog/edit/${id}`)} style={{ color: 'var(--primary)' }}>
              <FaPen /> Edit Article
            </DeleteBtn>
            <DeleteBtn onClick={handleDelete}>
              <FaTrash /> Delete Article
            </DeleteBtn>
          </div>
        )}

        {user && user.id !== post.author?._id && (
          <DeleteBtn onClick={() => setShowReportModal(true)} style={{ color: '#ffb900' }}>
            <FaFlag /> Report Content
          </DeleteBtn>
        )}
      </ArticleHeader>

      <ReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={post._id}
        targetName={post.title}
        reportType="Blog"
      />

      {post.summary && (
        <SummaryBox>
          <p>{post.summary}</p>
        </SummaryBox>
      )}

      <Content>
        {post.content}
      </Content>

      {related.length > 0 && (
        <RelatedSection>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Related Legal Insights</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Based on your current reading</p>
          <RelatedGrid>
            {related.map(rel => (
              <MiniCard key={rel._id} onClick={() => navigate(`/dashboard/blog/${rel._id}`)}>
                <h4>{rel.title}</h4>
                <p>{rel.summary || rel.content.substring(0, 80) + '...'}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {rel.category}
                </div>
              </MiniCard>
            ))}
          </RelatedGrid>
        </RelatedSection>
      )}

      <CommentSection>
        <h3 style={{ marginBottom: '1.5rem' }}>Comments ({post.comments?.length || 0})</h3>

        {error && (
          <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
            {error}
          </div>
        )}

        {user ? (
          <CommentInput>
            <textarea
              placeholder="Share your thoughts..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleComment} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </CommentInput>
        ) : (
          <div style={{ marginBottom: '2rem', color: 'gray' }}>Log in to leave a comment.</div>
        )}

        <CommentList>
          {post.comments?.map(cmt => (
            <CommentItem key={cmt._id}>
              <UserAvatar 
                src={cmt.user?.profilePicture} 
                name={cmt.user?.name} 
                size="40px" 
              />
              <CommentContent>
                <div className="header">
                  <strong>{cmt.user?.name}</strong>
                  <span>{new Date(cmt.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{cmt.content}</p>
              </CommentContent>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </PageContainer>
  );
};

export default BlogDetail;
