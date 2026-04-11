import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import DeleteModal from '../../components/Common/DeleteModal';
import { FaFilter, FaSearch, FaEnvelopeOpenText, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  color: var(--text-main);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;

  @media (min-width: 640px) {
    font-size: 1.8rem;
  }
`;

const FilterSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--bg-panel);
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid var(--border);

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }

    select, input {
        background: var(--bg-dark);
        border: 1px solid var(--border);
        color: white;
        padding: 0.6rem 1rem;
        border-radius: 8px;
        outline: none;
        font-size: 0.9rem;
        width: 100%;

        @media (min-width: 768px) {
            width: auto;
        }

        &:focus { border-color: var(--primary); }
    }
`;

const TableContainer = styled.div`
    background: var(--bg-panel);
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow-x: auto;
    display: block;
    width: 100%;
    -webkit-overflow-scrolling: touch;

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
  min-width: 900px;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.25rem 1rem;
  background: rgba(255,255,255,0.02);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  font-size: 0.95rem;
  vertical-align: middle;
`;

const StatusSelect = styled.select`
    background: ${props => {
        switch (props.value) {
            case 'Resolved': return '#36b37e20';
            case 'In Review': return '#ffab0020';
            default: return '#ff563020';
        }
    }};
    color: ${props => {
        switch (props.value) {
            case 'Resolved': return '#36b37e';
            case 'In Review': return '#ffab00';
            default: return '#ff5630';
        }
    }};
    border: 1px solid currentColor;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    outline: none;

    option {
        background: var(--bg-dark);
        color: white;
    }
`;

const TypeSelect = styled.select`
    background: rgba(108, 93, 211, 0.1);
    color: #6c5dd3;
    border: 1px solid currentColor;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    outline: none;

    option {
        background: var(--bg-dark);
        color: white;
        text-transform: none;
    }
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(108, 93, 211, 0.1)'};
  color: ${props => props.danger ? '#ef4444' : '#6c5dd3'};
  border: 1px solid currentColor;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.danger ? '#ef4444' : '#6c5dd3'};
    color: white;
  }
`;

const ContactManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [contactToDelete, setContactToDelete] = useState(null);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/contact/submissions?issueType=${filterType}`);
            if (res.data.success) {
                setContacts(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [filterType]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await api.patch(`/api/contact/${id}/status`, { status: newStatus });
            if (res.data.success) {
                setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleIssueTypeUpdate = async (id, newType) => {
        try {
            const res = await api.patch(`/api/contact/${id}/issue-type`, { issueType: newType });
            if (res.data.success) {
                setContacts(contacts.map(c => c._id === id ? { ...c, issueType: newType } : c));
                toast.success(`Issue category updated to ${newType}`);
            }
        } catch (error) {
            toast.error("Failed to update category");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/api/contact/${deleteId}`);
            setContacts(contacts.filter(c => c._id !== deleteId));
            toast.success("Submission deleted");
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setDeleteId(null);
            setContactToDelete(null);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Header>
                <Title><FaEnvelopeOpenText /> Support & Reports</Title>
            </Header>

            <FilterSection>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaFilter color="var(--text-secondary)" />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="All">All Issue Types</option>
                        <option value="General Contact">General Contact</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Report User">Report User</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Feedback">Feedback</option>
                    </select>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        style={{ width: '100%', paddingLeft: '35px' }}
                        placeholder="Search by name, email or message content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </FilterSection>

            <TableContainer>
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <FaSpinner className="spin" size={32} />
                        <p style={{ marginTop: '1rem' }}>Loading support queue...</p>
                    </div>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <Th>User Info</Th>
                                <Th>Type</Th>
                                <Th>Message</Th>
                                <Th>Date</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.length === 0 ? (
                                <tr><Td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No submissions found.</Td></tr>
                            ) : (
                                filteredContacts.map(contact => (
                                    <tr key={contact._id}>
                                        <Td>
                                            <div style={{ fontWeight: 600 }}>{contact.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{contact.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.2rem', textTransform: 'capitalize' }}>{contact.role}</div>
                                        </Td>
                                        <Td>
                                            <TypeSelect
                                                value={contact.issueType || 'General Contact'}
                                                onChange={(e) => handleIssueTypeUpdate(contact._id, e.target.value)}
                                            >
                                                <option value="General Contact">General Contact</option>
                                                <option value="Technical Issue">Technical Issue</option>
                                                <option value="Report User">Report User</option>
                                                <option value="Feature Request">Feature Request</option>
                                                <option value="Feedback">Feedback</option>
                                            </TypeSelect>
                                        </Td>
                                        <Td style={{ maxWidth: '300px' }}>
                                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{contact.message}</div>
                                        </Td>
                                        <Td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                            {new Date(contact.createdAt).toLocaleDateString()}
                                        </Td>
                                        <Td>
                                            <StatusSelect
                                                value={contact.status}
                                                onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Review">In Review</option>
                                                <option value="Resolved">Resolved</option>
                                            </StatusSelect>
                                        </Td>
                                        <Td>
                                            <ActionButton danger onClick={() => { setDeleteId(contact._id); setContactToDelete(contact); }}>
                                                <FaTrash size={14} />
                                            </ActionButton>
                                        </Td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}
            </TableContainer>

            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => { setDeleteId(null); setContactToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Submission?"
                message="Are you sure you want to delete this submission? This action cannot be undone."
                itemName={contactToDelete?.name}
            />
        </Container>
    );
};

export default ContactManagement;
