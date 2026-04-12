import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import ConfirmModal from '../../components/Common/ConfirmModal';
import {
    FaSearch, FaGavel, FaTrash, FaEdit, FaCheck, FaTimes,
    FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight,
    FaBalanceScale, FaUserAlt, FaCalendarAlt
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
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 768px) {
    width: 250px;
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

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: white;
  cursor: pointer;

  @media (min-width: 768px) {
    width: auto;
  }

  &:focus { outline: none; border-color: var(--primary); }
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
  min-width: 900px;
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
  color: ${props => props.dim ? 'var(--text-secondary)' : 'var(--text-main)'};
  vertical-align: middle;
  font-size: 0.9rem;
`;

const CaseTitle = styled.div`
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
    font-size: 1.2rem;
  }
  .text {
    h4 { margin: 0; font-size: 0.95rem; color: white; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
        switch (props.status) {
            case 'APPROVED': return 'rgba(16, 185, 129, 0.1)';
            case 'REJECTED': return 'rgba(239, 68, 68, 0.1)';
            default: return 'rgba(245, 158, 11, 0.1)';
        }
    }};
  color: ${props => {
        switch (props.status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            default: return '#f59e0b';
        }
    }};
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--text-secondary)'};
  font-size: 1rem;
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
  &:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  .info { font-size: 0.85rem; color: var(--text-secondary); }
  .btns { display: flex; gap: 0.5rem; }
`;

const PageBtn = styled.button`
  background: ${props => props.active ? 'var(--primary)' : 'var(--bg-dark)'};
  color: white;
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'var(--border)'};
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CaseManagement = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [caseToDelete, setCaseToDelete] = useState(null);

    const fetchCases = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/cases?page=${page}&search=${search}&status=${status}`);
            if (res.data.status === 'success') {
                setCases(res.data.data.cases);
                setTotalPages(res.data.pages);
                setTotalResults(res.data.total);
            }
        } catch (error) {
            console.error("Failed to fetch cases", error);
        } finally {
            setLoading(false);
        }
    }, [page, search, status]);

    useEffect(() => {
        const timeout = setTimeout(fetchCases, 500);
        return () => clearTimeout(timeout);
    }, [fetchCases]);

    const handleUpdateStatus = async (caseObj, newStatus) => {
        try {
            const res = await api.patch(`/api/admin/cases/${caseObj._id}`, { status: newStatus });
            if (res.data.status === 'success') {
                setCases(cases.map(c => c._id === caseObj._id ? res.data.data.case : c));
            }
        } catch (error) {
            alert("Failed to update case status");
        }
    };

    const handleToggleImportance = async (caseObj) => {
        try {
            const res = await api.patch(`/api/admin/cases/${caseObj._id}`, {
                isImportant: !caseObj.isImportant
            });
            if (res.data.status === 'success') {
                setCases(cases.map(c => c._id === caseObj._id ? res.data.data.case : c));
            }
        } catch (error) {
            alert("Failed to update importance status");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/api/admin/cases/${deleteId}`);
            setCases(cases.filter(c => c._id !== deleteId));
            setDeleteId(null);
            setCaseToDelete(null);
        } catch (error) {
            alert("Failed to delete case entry");
        }
    };

    return (
        <Container>
            <Header>
                <TitleSection>
                    <h2>Case Library Moderation</h2>
                    <p>Review legal summaries, verify precedents, and manage archival correctness.</p>
                </TitleSection>
                <Controls>
                    <SearchBox>
                        <FaSearch />
                        <input
                            placeholder="Search legal precedents..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </SearchBox>
                    <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="all">All Submissions</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </FilterSelect>
                </Controls>
            </Header>

            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>Case Details</Th>
                            <Th>Uploader</Th>
                            <Th>Visibility / Status</Th>
                            <Th>Important</Th>
                            <Th style={{ textAlign: 'right' }}>Moderation</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing library...</Td></tr>
                        ) : cases.length === 0 ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No legal records found.</Td></tr>
                        ) : (
                            cases.map(caseObj => (
                                <tr key={caseObj._id}>
                                    <Td>
                                        <CaseTitle>
                                            <div className="icon"><FaBalanceScale /></div>
                                            <div className="text">
                                                <h4>{caseObj.title}</h4>
                                                <p>{caseObj.court} • {caseObj.year}</p>
                                            </div>
                                        </CaseTitle>
                                    </Td>
                                    <Td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600 }}>
                                                {caseObj.uploader?.name || 'L.A.W. System'}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {caseObj.uploader?.role ? `${caseObj.uploader.role.replace('_', ' ')} Submission` : 'Official Record'}
                                            </span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <StatusBadge status={caseObj.status || 'PENDING'}>
                                            {caseObj.status || 'PENDING'}
                                        </StatusBadge>
                                    </Td>
                                    <Td>
                                        <ActionBtn
                                            color={caseObj.isImportant ? '#6c5dd3' : 'var(--text-secondary)'}
                                            hoverColor="#6c5dd3"
                                            onClick={() => handleToggleImportance(caseObj)}
                                            title={caseObj.isImportant ? "Unmark Importance" : "Mark as Important Case"}
                                        >
                                            {caseObj.isImportant ? <FaBookmark /> : <FaRegBookmark />}
                                        </ActionBtn>
                                    </Td>
                                    <Td style={{ textAlign: 'right' }}>
                                        <ActionBtn
                                            color="#10b981"
                                            hoverColor="#059669"
                                            disabled={caseObj.status === 'APPROVED'}
                                            onClick={() => handleUpdateStatus(caseObj, 'APPROVED')}
                                            title="Approve Submission"
                                        >
                                            <FaCheck />
                                        </ActionBtn>
                                        <ActionBtn
                                            color="#f59e0b"
                                            hoverColor="#d97706"
                                            disabled={caseObj.status === 'REJECTED'}
                                            onClick={() => handleUpdateStatus(caseObj, 'REJECTED')}
                                            title="Reject Submission"
                                        >
                                            <FaTimes />
                                        </ActionBtn>
                                        <ActionBtn
                                            color="#ef4444"
                                            hoverColor="#dc2626"
                                            onClick={() => { setDeleteId(caseObj._id); setCaseToDelete(caseObj); }}
                                            title="Permanently Delete"
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
                        <div className="info">Records {((page - 1) * 10) + 1} to {Math.min(page * 10, totalResults)} of {totalResults}</div>
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

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => { setDeleteId(null); setCaseToDelete(null); }}
                onConfirm={confirmDelete}
                title="Remove Case Record?"
                message="This will permanently remove the case entry from the public library. Content will no longer be searchable or referenceable."
                itemName={caseToDelete?.title}
                type="danger"
            />
        </Container>
    );
};

export default CaseManagement;
