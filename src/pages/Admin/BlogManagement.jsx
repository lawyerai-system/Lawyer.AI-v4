import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import DeleteModal from '../../components/Common/DeleteModal';
import {
    FaSearch, FaFilter, FaStar, FaRegStar, FaTrash, FaEdit,
    FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaBlog
} from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;

  @media (min-width: 640px) {
    gap: 2rem;
    padding: 1rem 0;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TitleSection = styled.div`
  h2 {
    color: var(--text-main);
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    @media (min-width: 640px) {
      font-size: 1.8rem;
    }
  }
  p {
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
    font-size: 0.85rem;
    @media (min-width: 640px) {
      font-size: 0.9rem;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: 300px;
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
  input {
    width: 100%;
    padding: 0.7rem 1rem 0.7rem 2.8rem;
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: white;
    &:focus { outline: none; border-color: var(--primary); }
  }
`;

const TableContainer = styled.div`
  background: var(--bg-panel);
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow-x: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  vertical-align: middle;
`;

const BlogInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  .icon {
    width: 40px;
    height: 40px;
    background: rgba(108, 93, 211, 0.1);
    color: var(--primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .details {
    h4 { margin: 0; font-size: 1rem; color: white; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const CategoryBadge = styled.span`
  padding: 0.3rem 0.6rem;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--text-secondary)'};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255,255,255,0.05);
    color: ${props => props.hoverColor || 'white'};
    transform: translateY(-2px);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  .info { font-size: 0.9rem; color: var(--text-secondary); }
  .btns { display: flex; gap: 0.5rem; }
`;

const PageBtn = styled.button`
  background: ${props => props.active ? 'var(--primary)' : 'var(--bg-dark)'};
  color: white;
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'var(--border)'};
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { border-color: var(--primary); background: ${props => props.active ? 'var(--primary)' : 'rgba(108, 93, 211, 0.2)'}; }
`;

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [blogToDelete, setBlogToDelete] = useState(null);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/blogs?page=${page}&search=${search}`);
            if (res.data.status === 'success') {
                setBlogs(res.data.data.blogs);
                setTotalPages(res.data.pages);
                setTotalResults(res.data.total);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const timeout = setTimeout(fetchBlogs, 500);
        return () => clearTimeout(timeout);
    }, [fetchBlogs]);

    const handleToggleFeatured = async (blog) => {
        try {
            const res = await api.patch(`/api/admin/blogs/${blog._id}`, {
                isFeatured: !blog.isFeatured
            });
            if (res.data.status === 'success') {
                setBlogs(blogs.map(b => b._id === blog._id ? res.data.data.blog : b));
            }
        } catch (error) {
            alert("Failed to update blog status");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/api/admin/blogs/${deleteId}`);
            setBlogs(blogs.filter(b => b._id !== deleteId));
            setDeleteId(null);
            setBlogToDelete(null);
        } catch (error) {
            alert("Failed to delete blog post");
        }
    };

    return (
        <Container>
            <Header>
                <TitleSection>
                    <h2>Blog Moderation</h2>
                    <p>Manage community insights, legal updates, and featured content.</p>
                </TitleSection>
                <Controls>
                    <SearchBox>
                        <FaSearch />
                        <input
                            placeholder="Find by title or content..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </SearchBox>
                </Controls>
            </Header>

            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>Article Details</Th>
                            <Th>Category</Th>
                            <Th>Published</Th>
                            <Th>Visibility</Th>
                            <Th style={{ textAlign: 'right' }}>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>Optimizing view...</Td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No articles match your criteria.</Td></tr>
                        ) : (
                            blogs.map(blog => (
                                <tr key={blog._id}>
                                    <Td>
                                        <BlogInfo>
                                            <div className="icon"><FaBlog /></div>
                                            <div className="details">
                                                <h4>{blog.title}</h4>
                                                <p>by {blog.author?.name || 'Contributor'}</p>
                                            </div>
                                        </BlogInfo>
                                    </Td>
                                    <Td><CategoryBadge>{blog.category}</CategoryBadge></Td>
                                    <Td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </Td>
                                    <Td>
                                        <ActionBtn
                                            color={blog.isFeatured ? '#fbbf24' : 'var(--text-secondary)'}
                                            hoverColor="#fbbf24"
                                            onClick={() => handleToggleFeatured(blog)}
                                            title={blog.isFeatured ? "Unfeature" : "Mark as Featured"}
                                        >
                                            {blog.isFeatured ? <FaStar /> : <FaRegStar />}
                                        </ActionBtn>
                                    </Td>
                                    <Td style={{ textAlign: 'right' }}>
                                        <ActionBtn hoverColor="var(--primary)" title="Edit Post"><FaEdit /></ActionBtn>
                                        <ActionBtn
                                            color="#ef4444"
                                            hoverColor="#ff4d4d"
                                            onClick={() => { setDeleteId(blog._id); setBlogToDelete(blog); }}
                                            title="Delete Post"
                                        >
                                            <FaTrash />
                                        </ActionBtn>
                                    </Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                {!loading && totalPages > 1 && (
                    <Pagination>
                        <div className="info">Showing {blogs.length} of {totalResults} entries</div>
                        <div className="btns">
                            <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}><FaChevronLeft /></PageBtn>
                            {[...Array(totalPages)].map((_, i) => (
                                <PageBtn key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PageBtn>
                            ))}
                            <PageBtn disabled={page === totalPages} onClick={() => setPage(page + 1)}><FaChevronRight /></PageBtn>
                        </div>
                    </Pagination>
                )}
            </TableContainer>

            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => { setDeleteId(null); setBlogToDelete(null); }}
                onConfirm={confirmDelete}
                title="Permanently Delete Article?"
                message={`This will remove the blog post from the platform forever. This action cannot be undone.`}
                itemName={blogToDelete?.title}
            />
        </Container>
    );
};

export default BlogManagement;
