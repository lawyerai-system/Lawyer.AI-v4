import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import { FaBullhorn, FaPlus, FaTrash, FaEdit, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../components/Common/ConfirmModal';

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
`;

const AddButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  &:hover { opacity: 0.9; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: transform 0.2s;
  &:hover { transform: translateY(-4px); border-color: var(--primary); }
`;

const Badge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: inline-block;
  background: ${props => {
    switch (props.type) {
      case 'maintenance': return '#f7971e20';
      case 'resource': return '#00b09b20';
      case 'alert': return '#ff416c20';
      default: return '#6c5dd320';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'maintenance': return '#f7971e';
      case 'resource': return '#00b09b';
      case 'alert': return '#ff416c';
      default: return '#6c5dd3';
    }
  }};
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
`;

const CardContent = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--text-secondary)'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  &:hover { background: rgba(255,255,255,0.05); }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--bg-panel);
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--border);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label { font-size: 0.85rem; color: var(--text-secondary); }
  input, select, textarea {
    background: var(--bg-dark);
    border: 1px solid var(--border);
    color: white;
    padding: 0.75rem;
    border-radius: 8px;
    outline: none;
    &:focus { border-color: var(--primary); }
  }
`;

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'feature',
        isActive: true,
        expiresAt: ''
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: null
    });

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/api/announcements');
            setAnnouncements(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await api.patch(`/api/announcements/${editData._id}`, formData);
                toast.success("Announcement updated");
            } else {
                await api.post('/api/announcements', formData);
                toast.success("Announcement created");
            }
            setShowModal(false);
            setEditData(null);
            setFormData({ title: '', content: '', type: 'feature', isActive: true, expiresAt: '' });
            fetchAnnouncements();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        const id = deleteModal.id;
        try {
            await api.delete(`/api/announcements/${id}`);
            toast.success("Deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
            fetchAnnouncements();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const toggleStatus = async (item) => {
        try {
            await api.patch(`/api/announcements/${item._id}`, { isActive: !item.isActive });
            fetchAnnouncements();
            toast.success(`Announcement ${!item.isActive ? 'activated' : 'deactivated'}`);
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const openEdit = (item) => {
        setEditData(item);
        setFormData({
            title: item.title,
            content: item.content,
            type: item.type,
            isActive: item.isActive,
            expiresAt: item.expiresAt ? item.expiresAt.split('T')[0] : ''
        });
        setShowModal(true);
    };

    return (
        <Container>
            <Header>
                <Title><FaBullhorn /> Platform Announcements</Title>
                <AddButton onClick={() => { setEditData(null); setShowModal(true); }}>
                    <FaPlus /> New Announcement
                </AddButton>
            </Header>

            {loading ? <p>Loading...</p> : (
                <Grid>
                    {announcements.map(item => (
                        <Card key={item._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Badge type={item.type}>{item.type}</Badge>
                                <ActionBtn 
                                    onClick={() => toggleStatus(item)}
                                    color={item.isActive ? '#36b37e' : '#ff5630'}
                                >
                                    {item.isActive ? <FaCheckCircle size={18} /> : <FaTimesCircle size={18} />}
                                </ActionBtn>
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardContent>{item.content}</CardContent>
                            <CardFooter>
                                <div>
                                    <FaCalendarAlt style={{ marginRight: '5px' }} />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                <Actions>
                                    <ActionBtn color="var(--primary)" onClick={() => openEdit(item)}><FaEdit /></ActionBtn>
                                    <ActionBtn color="#ff5630" onClick={() => setDeleteModal({ isOpen: true, id: item._id })}><FaTrash /></ActionBtn>
                                </Actions>
                            </CardFooter>
                        </Card>
                    ))}
                </Grid>
            )}

            {showModal && (
                <Modal onClick={() => setShowModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editData ? 'Edit' : 'Create'} Announcement</h3>
                        <Form onSubmit={handleSubmit}>
                            <InputGroup>
                                <label>Title</label>
                                <input 
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. System Maintenance"
                                />
                            </InputGroup>
                            <InputGroup>
                                <label>Type</label>
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="feature">New Feature</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="resource">Legal Resource</option>
                                    <option value="alert">Alert</option>
                                </select>
                            </InputGroup>
                            <InputGroup>
                                <label>Content</label>
                                <textarea 
                                    required
                                    rows="4"
                                    value={formData.content}
                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                    placeholder="Announcement details..."
                                />
                            </InputGroup>
                            <InputGroup>
                                <label>Expiry Date (Optional)</label>
                                <input 
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                                />
                            </InputGroup>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <AddButton type="submit" style={{ flex: 1 }}>{editData ? 'Update' : 'Publish'}</AddButton>
                                <AddButton 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)' }}
                                >
                                    Cancel
                                </AddButton>
                            </div>
                        </Form>
                    </ModalContent>
                </Modal>
            )}

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete Announcement"
                message="Are you sure you want to delete this announcement? This action cannot be undone."
                confirmText="Delete Now"
                type="danger"
                icon="🗑️"
            />
        </Container>
    );
};

export default AnnouncementManagement;
