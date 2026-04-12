import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaPen } from 'react-icons/fa6';

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

const BlogEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'General Law',
        content: '',
        image: '',
        tags: []
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Fetch existing post
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/api/blogs/${id}`);
                if (res.data.status === 'success') {
                    const post = res.data.data;
                    setFormData({
                        title: post.title,
                        category: post.category,
                        content: post.content,
                        image: post.image,
                        tags: post.tags || []
                    });
                    if (post.image && !post.image.includes('default-blog.jpg')) {
                        setPreview(post.image.startsWith('http') ? post.image : post.image);
                    }
                }
            } catch (err) {
                console.error("Failed to load post", err);
                setError("Failed to load post for editing");
                // navigate('/dashboard/blog'); // Don't navigate away immediately so user can see error
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, navigate]);

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
        setSubmitting(true);
        setError(null);

        try {
            let imagePath = formData.image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);

                const uploadRes = await api.post('/api/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imagePath = uploadRes.data.filePath;
            }

            const res = await api.patch(`/api/blogs/${id}`, {
                title: formData.title,
                category: formData.category,
                content: formData.content,
                image: imagePath,
                tags: formData.tags
            });

            if (res.data.status === 'success') {
                navigate(`/dashboard/blog/${id}`);
            }
        } catch (err) {
            console.error("Failed to update blog", err);
            setError(err.response?.data?.message || "Failed to update post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setFormData({ ...formData, image: '' });
        setPreview(null);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;

    return (
        <Container>
            <BackBtn onClick={() => navigate(`/dashboard/blog/${id}`)}>
                <FaArrowLeft /> Cancel Editing
            </BackBtn>

            <FormTitle>Edit Article</FormTitle>

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
                        <option value="General Law">General Law</option>
                        <option value="Criminal Law">Criminal Law</option>
                        <option value="Civil Law">Civil Law</option>
                        <option value="Constitutional Law">Constitutional Law</option>
                        <option value="Case Studies">Case Studies</option>
                        <option value="Corporate Law">Corporate Law</option>
                        <option value="Family Law">Family Law</option>
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
                    {preview ? (
                        <div style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                            <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: '#ff4d4d',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                title="Delete current cover image"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            marginTop: '1rem',
                            width: '100%',
                            height: '200px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            border: '2px dashed rgba(255,255,255,0.1)'
                        }}>
                            ⚖️
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

                <SubmitBtn type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Article'}
                </SubmitBtn>
            </form>
        </Container >
    );
};

export default BlogEdit;
