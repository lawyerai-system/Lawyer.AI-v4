import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/Common/ConfirmModal';
import {
    FaSearch, FaFilter, FaUserShield, FaUserGraduate, FaUser,
    FaUserSlash, FaUserCheck, FaTrash, FaEllipsisV, FaChevronLeft,
    FaChevronRight, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa';
import UserAvatar from '../../components/Common/UserAvatar';

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
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
  }
`;

const TitleSection = styled.div`
  h2 {
    color: var(--text-main);
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
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

const ActionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  background: var(--bg-panel);
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 1.5rem;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.8rem;
    background: var(--bg-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-main);
    font-size: 0.95rem;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108, 93, 211, 0.2);
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 0.8rem 1.2rem;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;

  @media (min-width: 768px) {
    flex: none;
    min-width: 150px;
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const TableWrapper = styled.div`
  background: var(--bg-panel);
  border-radius: 16px;
  border: 1px solid var(--border);
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);

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
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--border);
`;

const Td = styled.td`
  padding: 1.2rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  font-size: 0.95rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    overflow: hidden;
    flex-shrink: 0;

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .details {
    display: flex;
    flex-direction: column;
    .name { font-weight: 600; color: white; }
    .email { font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const RoleBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
        switch (props.role) {
            case 'admin': return 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);';
            case 'lawyer': return 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);';
            case 'law_student': return 'background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2);';
            default: return 'background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2);';
        }
    }}
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  background: ${props => props.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.active ? '#10b981' : '#ef4444'};
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'var(--primary)'};
    color: white;
    transform: translateY(-2px);
  }

  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-panel);
  border-radius: 0 0 16px 16px;
  border: 1px solid var(--border);
  border-top: none;

  .info { color: var(--text-secondary); font-size: 0.9rem; }
  .btns { display: flex; gap: 0.5rem; }
`;

const PageBtn = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover { background: ${props => props.active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

// Modal Components (Refined)
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px); display: flex; justify-content: center;
  align-items: center; z-index: 2000; padding: 1rem;
`;

const ModalContent = styled.div`
  background: #161821; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px; width: 100%; max-width: 550px;
  position: relative; overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1.5rem; text-align: center;
  background: linear-gradient(180deg, rgba(108, 93, 211, 0.1) 0%, transparent 100%);
`;

const ModalBody = styled.div` padding: 0 2rem 2rem; `;

const ProfileSection = styled.div`
  display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem;
  
  .avatar {
    width: 90px; height: 90px; border-radius: 24px; background: var(--primary);
    margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; color: white; border: 4px solid var(--bg-dark);
    img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }
  }
  h3 { margin: 0; font-size: 1.4rem; color: white; }
  span { color: var(--text-secondary); font-size: 0.9rem; }
`;

const InfoGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  label { display: block; font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; font-weight: 700; }
  p { margin: 0; color: white; font-weight: 600; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; }
`;

const ActionRow = styled.div`
  display: flex; gap: 0.8rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08);
`;

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pages: 1 });

    // Filters & Search
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        status: 'all',
        page: 1,
        limit: 10
    });

    // Modals
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { search, role, status, page, limit } = filters;
            const res = await api.get(`/api/admin/users`, {
                params: { search, role, status, page, limit }
            });
            if (res.data.status === 'success') {
                setUsers(res.data.data.users);
                setStats({
                    total: res.data.total,
                    pages: res.data.pages
                });
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timeout = setTimeout(fetchUsers, 500); // Debounce search
        return () => clearTimeout(timeout);
    }, [fetchUsers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleStatusUpdate = async (userId, isActive) => {
        try {
            const res = await api.patch(`/api/admin/users/${userId}/status`, { isActive });
            if (res.data.status === 'success') {
                fetchUsers();
                if (selectedUser?._id === userId) {
                    setSelectedUser({ ...selectedUser, isActive });
                }
                setConfirmModal({ isOpen: false, type: '', data: null });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        }
    };

    const handleRoleUpdate = async (userId, role) => {
        try {
            const res = await api.patch(`/api/admin/users/${userId}/role`, { role });
            if (res.data.status === 'success') {
                fetchUsers();
                if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, role });
                setConfirmModal({ isOpen: false, type: '', data: null });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.user) return;
        try {
            await api.delete(`/api/admin/users/${deleteModal.user._id}`);
            fetchUsers();
            setDeleteModal({ isOpen: false, user: null });
            setSelectedUser(null);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete");
        }
    };

    const openConfirm = (type, data) => {
        setConfirmModal({ isOpen: true, type, data });
    };

    return (
        <Container>
            <Header>
                <TitleSection>
                    <h2>User Management</h2>
                    <p>Review system accounts, manage roles, and monitor user activity.</p>
                </TitleSection>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 'bold' }}>
                    Total Users: {stats.total}
                </div>
            </Header>

            <ActionGrid>
                <SearchBox>
                    <FaSearch />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </SearchBox>
                <FilterGroup>
                    <Select name="role" value={filters.role} onChange={handleFilterChange}>
                        <option value="all">All Roles</option>
                        <option value="civilian">Civilians</option>
                        <option value="law_student">Students</option>
                        <option value="lawyer">Lawyers</option>
                    </Select>
                    <Select name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="all">Any Status</option>
                        <option value="active">Active Only</option>
                        <option value="suspended">Suspended Only</option>
                    </Select>
                </FilterGroup>
            </ActionGrid>

            {loading && users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                    Loading users database...
                </div>
            ) : (
                <>
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>User Profile</Th>
                                    <Th>Role</Th>
                                    <Th>Join Date</Th>
                                    <Th>Account Status</Th>
                                    <Th style={{ textAlign: 'right' }}>Management</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <Td>
                                            <UserInfo>
                                                <UserAvatar
                                                    src={u.profileImage}
                                                    name={u.name}
                                                    size="40px"
                                                    className="avatar"
                                                />
                                                <div className="details">
                                                    <span className="name">{u.name}</span>
                                                    <span className="email">{u.email}</span>
                                                </div>
                                            </UserInfo>
                                        </Td>
                                        <Td>
                                            <RoleBadge role={u.role}>
                                                {u.role === 'admin' && <FaShieldAlt size={10} />}
                                                {u.role === 'lawyer' && <FaUserShield size={10} />}
                                                {u.role === 'law_student' && <FaUserGraduate size={10} />}
                                                {u.role === 'civilian' && <FaUser size={10} />}
                                                {u.role.replace('_', ' ')}
                                            </RoleBadge>
                                        </Td>
                                        <Td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </Td>
                                        <Td>
                                            <StatusBadge active={u.isActive}>
                                                {u.isActive ? 'Active' : 'Suspended'}
                                            </StatusBadge>
                                        </Td>
                                        <Td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <ActionBtn title="View Details" onClick={() => setSelectedUser(u)}>
                                                    <FaInfoCircle size={14} />
                                                </ActionBtn>
                                                <ActionBtn
                                                    title={u.isActive ? "Suspend Account" : "Reactivate"}
                                                    variant={u.isActive ? 'danger' : 'success'}
                                                    disabled={u.role === 'admin'}
                                                    onClick={() => openConfirm('status', u)}
                                                >
                                                    {u.isActive ? <FaUserSlash size={14} /> : <FaUserCheck size={14} />}
                                                </ActionBtn>
                                                <ActionBtn
                                                    variant="danger"
                                                    title="Permanently Delete"
                                                    disabled={u.role === 'admin' || u._id === currentUser?.id}
                                                    onClick={() => setDeleteModal({ isOpen: true, user: u })}
                                                >
                                                    <FaTrash size={14} />
                                                </ActionBtn>
                                            </div>
                                        </Td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr><Td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>No matching users found.</Td></tr>
                                )}
                            </tbody>
                        </Table>
                    </TableWrapper>

                    <Pagination>
                        <div className="info">
                            Showing page <b>{filters.page}</b> of <b>{stats.pages}</b>
                        </div>
                        <div className="btns">
                            <PageBtn
                                disabled={filters.page === 1}
                                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                            >
                                <FaChevronLeft />
                            </PageBtn>
                            {[...Array(stats.pages)].map((_, i) => (
                                <PageBtn
                                    key={i}
                                    active={filters.page === i + 1}
                                    onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                                >
                                    {i + 1}
                                </PageBtn>
                            )).slice(0, 5)}
                            <PageBtn
                                disabled={filters.page === stats.pages || stats.pages === 0}
                                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                            >
                                <FaChevronRight />
                            </PageBtn>
                        </div>
                    </Pagination>
                </>
            )}

            {/* Profile Detail Modal */}
            {selectedUser && (
                <ModalOverlay onClick={() => setSelectedUser(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ProfileSection>
                                <UserAvatar
                                    src={selectedUser.profileImage}
                                    name={selectedUser.name}
                                    size="90px"
                                    className="avatar"
                                />
                                <h3>{selectedUser.name}</h3>
                                <span>{selectedUser.email}</span>
                            </ProfileSection>
                        </ModalHeader>
                        <ModalBody>
                            <InfoGrid>
                                <InfoItem>
                                    <label>Role</label>
                                    <p style={{ textTransform: 'capitalize' }}>{selectedUser.role.replace('_', ' ')}</p>
                                </InfoItem>
                                <InfoItem>
                                    <label>Status</label>
                                    <p style={{ color: selectedUser.isActive ? '#10b981' : '#ef4444' }}>
                                        {selectedUser.isActive ? 'Active Account' : 'Suspended Account'}
                                    </p>
                                </InfoItem>
                                <InfoItem>
                                    <label>Joined Platform</label>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </InfoItem>
                                <InfoItem>
                                    <label>Last Seen</label>
                                    <p>{selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'N/A'}</p>
                                </InfoItem>
                            </InfoGrid>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Change Access Level</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={selectedUser.role}
                                    disabled={selectedUser.role === 'admin'}
                                    onChange={(e) => openConfirm('role', { userId: selectedUser._id, newRole: e.target.value })}
                                >
                                    <option value="civilian">Civilian</option>
                                    <option value="law_student">Law Student</option>
                                    <option value="lawyer">Lawyer</option>
                                    <option value="admin">Administrator</option>
                                </Select>
                            </div>

                            <ActionRow>
                                <ActionButton
                                    style={{ flex: 1, background: selectedUser.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: selectedUser.isActive ? '#ef4444' : '#10b981', border: `1px solid ${selectedUser.isActive ? '#ef4444' : '#10b981'}` }}
                                    onClick={() => openConfirm('status', selectedUser)}
                                    disabled={selectedUser.role === 'admin'}
                                >
                                    {selectedUser.isActive ? 'Suspend User' : 'Unsuspend User'}
                                </ActionButton>
                                <ActionButton
                                    style={{ background: 'transparent', color: '#64748b', border: '1px solid #334155' }}
                                    onClick={() => setSelectedUser(null)}
                                >
                                    Close
                                </ActionButton>
                            </ActionRow>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Confirm Generic Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: '', data: null })}
                onConfirm={() => {
                    if (confirmModal.type === 'status') handleStatusUpdate(confirmModal.data._id, !confirmModal.data.isActive);
                    if (confirmModal.type === 'role') handleRoleUpdate(confirmModal.data.userId, confirmModal.data.newRole);
                }}
                title={confirmModal.type === 'status' ? (confirmModal.data?.isActive ? 'Suspend User?' : 'Reactivate User?') : 'Update User Role?'}
                message={confirmModal.type === 'status'
                    ? `Are you sure you want to ${confirmModal.data?.isActive ? 'suspend' : 'reactivate'} ${confirmModal.data?.name}'s access to the platform?`
                    : `Changing this user's role will modify their permissions immediately.`}
                confirmText="Confirm Action"
                type={confirmModal.type === 'status' && confirmModal.data?.isActive ? 'danger' : 'primary'}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, user: null })}
                onConfirm={handleDelete}
                itemName={deleteModal.user?.name}
                title="Permanently Delete User"
                message="This action is irreversible. All user data, linked blogs, and courtroom history will be permanently erased."
                type="danger"
            />
        </Container>
    );
};

// Internal Local Components
const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export default UserManagement;
