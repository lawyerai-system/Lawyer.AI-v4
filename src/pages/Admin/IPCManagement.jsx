import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { toast } from 'react-hot-toast';

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

const Title = styled.h2`
  color: var(--text-main);
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;

  @media (min-width: 640px) {
    font-size: 1.8rem;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  color: white;
  width: 100%;
  
  @media (min-width: 768px) {
    min-width: 300px;
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Button = styled.button`
  background: #7e3af2;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }
  
  &:hover {
    background: #6c2bd9;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
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
  background: var(--bg-panel);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem;
  background: rgba(255,255,255,0.03);
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 2px solid var(--border);
`;

const Td = styled.td`
  padding: 1.2rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  vertical-align: top;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#fee2e2' : '#e0e7ff'};
  color: ${props => props.danger ? '#ef4444' : '#4f46e5'};
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    filter: brightness(0.95);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--bg-panel);
  padding: 2.5rem;
  border-radius: 20px;
  width: 650px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  
  h3 { color: white; margin-top: 0; margin-bottom: 1.5rem; }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.8rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: white;
    font-family: inherit;
    
    &:focus { outline: none; border-color: var(--primary); }
  }
  
  textarea {
    min-height: 100px;
  }
`;

const IPCManagement = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({
        section: '',
        description: '',
        offence: '',
        punishment: ''
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: null
    });

    const fetchSections = async () => {
        setLoading(true);
        try {
            // Use search if provided, otherwise fetch all (default limit 20)
            const url = search ? `/api/ipc/search?query=${search}` : '/api/ipc?limit=50';
            const res = await api.get(url);
            if (res.data.status === 'success') {
                setSections(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch IPC", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchSections();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleEdit = (section) => {
        setEditingSection(section);
        setFormData({
            section: section.section,
            description: section.description,
            offence: section.offence || '',
            punishment: section.punishment || ''
        });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingSection(null);
        setFormData({
            section: '',
            description: '',
            offence: '',
            punishment: ''
        });
        setShowModal(true);
    };

    const handleDelete = async () => {
        const id = deleteModal.id;
        try {
            await api.delete(`/api/ipc/${id}`);
            setSections(sections.filter(s => s._id !== id));
            toast.success("Section deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            toast.error("Failed to delete section");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSection) {
                const res = await api.put(`/api/ipc/${editingSection._id}`, formData);
                if (res.data.status === 'success') {
                    // Update in place
                    setSections(sections.map(s => s._id === editingSection._id ? res.data.data : s));
                }
            } else {
                const res = await api.post('/api/ipc', formData);
                if (res.data.status === 'success') {
                    setSections([res.data.data, ...sections]);
                }
            }
            setShowModal(false);
        } catch (error) {
            alert("Failed to save IPC section");
        }
    };

    return (
        <Container>
            <Header>
                <Title>IPC Management</Title>
                <Controls>
                    <SearchInput
                        placeholder="Search Section, Description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleCreate}>+ New Section</Button>
                </Controls>
            </Header>

            {loading ? <p>Loading...</p> : (
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <Th width="15%">Section</Th>
                                <Th width="30%">Offence</Th>
                                <Th width="40%">Description</Th>
                                <Th width="15%">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map(s => (
                                <tr key={s._id}>
                                    <Td>{s.section}</Td>
                                    <Td>{s.offence}</Td>
                                    <Td>{s.description.substring(0, 100)}...</Td>
                                    <Td>
                                        <ActionGroup>
                                            <ActionButton onClick={() => handleEdit(s)}>Edit</ActionButton>
                                            <ActionButton danger onClick={() => setDeleteModal({ isOpen: true, id: s._id })}>Delete</ActionButton>
                                        </ActionGroup>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            )}

            {showModal && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3>{editingSection ? 'Edit Section' : 'New Section'}</h3>
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <label>IPC Section</label>
                                <input
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Offence</label>
                                <input
                                    value={formData.offence}
                                    onChange={e => setFormData({ ...formData, offence: e.target.value })}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Punishment</label>
                                <input
                                    value={formData.punishment}
                                    onChange={e => setFormData({ ...formData, punishment: e.target.value })}
                                />
                            </FormGroup>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <Button type="button" onClick={() => setShowModal(false)} style={{ background: '#9ca3af' }}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete IPC Section"
                message="Are you sure you want to delete this IPC section? This will remove it from the platform dictionary."
                confirmText="Delete Now"
                type="danger"
                icon="⚖️"
            />
        </Container>
    );
};

export default IPCManagement;
