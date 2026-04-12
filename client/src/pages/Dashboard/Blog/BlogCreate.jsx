import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { useSettings } from '../../../context/SettingsContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1rem;
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
  
  &:hover { color: var(--primary); }
`;

const FormTitle = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  input, textarea, select {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }

  textarea {
    resize: vertical;
    min-height: 300px;
  }
`;

const SubmitBtn = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const BlogCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    title: '',
    category: settings?.categories?.blog?.[0] || 'General Law',
    content: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imagePath = 'default-blog.jpg';

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await api.post('/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imagePath = uploadRes.data.filePath;
      }

      const res = await api.post('/api/blogs/create-blog', {
        ...formData,
        image: imagePath
      });

      if (res.data.status === 'success') {
        navigate('/dashboard/blog');
      }
    } catch (err) {
      console.error("Failed to create blog", err);
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackBtn onClick={() => navigate('/dashboard/blog')}>
        <FaArrowLeft /> Back to Blog
      </BackBtn>

      <FormTitle>Write New Article</FormTitle>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter a descriptive title..."
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {settings?.categories?.blog?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            )) || (
              <option value="General Law">General Law</option>
            )}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
            {['Criminal Law', 'Constitutional Law', 'Civil Law', 'Case Studies', 'Legal Procedure', 'Human Rights'].map(tag => (
              <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  style={{ width: 'auto' }}
                  checked={formData.tags?.includes(tag)}
                  onChange={(e) => {
                    const currentTags = formData.tags || [];
                    const newTags = e.target.checked
                      ? [...currentTags, tag]
                      : currentTags.filter(t => t !== tag);
                    setFormData({ ...formData, tags: newTags });
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </FormGroup>

        <FormGroup>
          <label>Cover Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <div style={{ marginTop: '1rem' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <label>Content</label>
          <textarea
            name="content"
            placeholder="Write your article content here..."
            value={formData.content}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {error && (
          <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Article'}
        </SubmitBtn>
      </form>
    </Container>
  );
};

export default BlogCreate;
