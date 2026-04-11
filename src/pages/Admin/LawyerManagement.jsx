import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import ConfirmModal from '../../components/Common/ConfirmModal';
import {
    FaUserCheck, FaUserTimes, FaQuestionCircle, FaSearch,
    FaFilter, FaIdCard, FaGavel, FaEnvelope, FaChevronRight,
    FaRegAddressCard, FaInfoCircle, FaCheckCircle, FaExclamationCircle
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

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 0;
  overflow-x: auto;
  white-space: nowrap;
  
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 640px) {
    gap: 1.5rem;
    padding-bottom: 0.5rem;
  }
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  padding: 0.8rem 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;

  @media (min-width: 640px) {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary);
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s;
    
    @media (min-width: 640px) {
      bottom: -0.6rem;
    }
  }

  &:hover { color: var(--primary); }

  .count {
    background: ${props => props.active ? 'rgba(108, 93, 211, 0.2)' : 'rgba(255,255,255,0.05)'};
    padding: 0.1rem 0.4rem;
    border-radius: 6px;
    font-size: 0.65rem;
    margin-left: 0.3rem;
    
    @media (min-width: 640px) {
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1100px) {
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }
`;

const Panel = styled.div`
  background: var(--bg-panel);
  border-radius: 20px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 640px) {
    width: 250px;
  }

  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    background: var(--bg-dark);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: white;
    font-size: 0.9rem;
    &:focus { outline: none; border-color: var(--primary); }
  }
  svg { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
`;

const CardList = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  @media (min-width: 640px) {
    height: 600px;
    padding: 1.5rem;
    gap: 1rem;
  }

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
`;

const LawyerCard = styled.div`
  padding: 1rem;
  background: ${props => props.active ? 'rgba(108, 93, 211, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : 'var(--border)'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    transform: translateX(4px);
    background: rgba(108, 93, 211, 0.05);
  }

  .info {
    h4 { margin: 0; color: white; margin-bottom: 4px; }
    p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const ReviewPanel = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    text-align: center;
    svg { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
  }
`;

const DetailGroup = styled.div`
  label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }
  .value {
    background: var(--bg-dark);
    padding: 1rem;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border: 1px solid rgba(255,255,255,0.05);
  }
`;

const FormSection = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: white;
  margin-bottom: 1rem;
  resize: none;
  font-family: inherit;
  &:focus { outline: none; border-color: var(--primary); }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => {
        switch (props.variant) {
            case 'success': return 'background: #10b981; color: white; &:hover { background: #059669; }';
            case 'danger': return 'background: #ef4444; color: white; &:hover { background: #dc2626; }';
            case 'warning': return 'background: #f59e0b; color: white; &:hover { background: #d97706; }';
            default: return 'background: rgba(255,255,255,0.1); color: white; &:hover { background: rgba(255,255,255,0.2); }';
        }
    }}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const LawyerManagement = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PENDING');
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [search, setSearch] = useState('');
    const [reason, setReason] = useState('');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });

    const fetchLawyers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/users');
            if (res.data.status === 'success') {
                const allLawyers = res.data.data.users.filter(u => u.role === 'lawyer');
                setLawyers(allLawyers);
            }
        } catch (error) {
            console.error("Failed to fetch lawyers", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLawyers();
    }, [fetchLawyers]);

    const filteredLawyers = lawyers.filter(l =>
        (l.verificationStatus === activeTab || (!l.verificationStatus && activeTab === 'PENDING')) &&
        (l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()))
    );

    const counts = {
        PENDING: lawyers.filter(l => !l.verificationStatus || l.verificationStatus === 'PENDING').length,
        APPROVED: lawyers.filter(l => l.verificationStatus === 'APPROVED').length,
        REJECTED: lawyers.filter(l => l.verificationStatus === 'REJECTED').length,
        NEEDS_INFO: lawyers.filter(l => l.verificationStatus === 'NEEDS_INFO').length
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedLawyer) return;
        try {
            const res = await api.patch(`/api/admin/users/${selectedLawyer._id}/verify`, {
                status,
                reason: (status === 'REJECTED' || status === 'NEEDS_INFO') ? reason : undefined
            });
            if (res.data.status === 'success') {
                const updated = res.data.data.user;
                setLawyers(prev => prev.map(l => l._id === updated._id ? updated : l));
                setSelectedLawyer(updated);
                setReason('');
                setConfirmModal({ isOpen: false, type: '', data: null });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <Container>
            <Header>
                <TitleSection>
                    <h2>Lawyer Verification</h2>
                    <p>Screen professional credentials and manage platform authenticity.</p>
                </TitleSection>
                <TabContainer>
                    <Tab active={activeTab === 'PENDING'} onClick={() => { setActiveTab('PENDING'); setSelectedLawyer(null); }}>
                        Pending <span className="count">{counts.PENDING}</span>
                    </Tab>
                    <Tab active={activeTab === 'APPROVED'} onClick={() => { setActiveTab('APPROVED'); setSelectedLawyer(null); }}>
                        Approved <span className="count">{counts.APPROVED}</span>
                    </Tab>
                    <Tab active={activeTab === 'REJECTED'} onClick={() => { setActiveTab('REJECTED'); setSelectedLawyer(null); }}>
                        Rejected <span className="count">{counts.REJECTED}</span>
                    </Tab>
                    <Tab active={activeTab === 'NEEDS_INFO'} onClick={() => { setActiveTab('NEEDS_INFO'); setSelectedLawyer(null); }}>
                        More Info <span className="count">{counts.NEEDS_INFO}</span>
                    </Tab>
                </TabContainer>
            </Header>

            <ContentGrid>
                <Panel>
                    <ListHeader>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Requests List</h3>
                        <SearchInput>
                            <FaSearch />
                            <input
                                placeholder="Search Name/Email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </SearchInput>
                    </ListHeader>
                    <CardList>
                        {loading ? <p>Scanning database...</p> :
                            filteredLawyers.map(l => (
                                <LawyerCard
                                    key={l._id}
                                    active={selectedLawyer?._id === l._id}
                                    onClick={() => setSelectedLawyer(l)}
                                >
                                    <div className="info">
                                        <h4>{l.name}</h4>
                                        <p>{l.specialization || 'General Practice'}</p>
                                    </div>
                                    <FaChevronRight opacity={0.3} />
                                </LawyerCard>
                            ))}
                        {filteredLawyers.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                No applications in this category.
                            </div>
                        )}
                    </CardList>
                </Panel>

                <Panel>
                    <ReviewPanel>
                        {!selectedLawyer ? (
                            <div className="empty-state">
                                <FaRegAddressCard />
                                <p>Select a lawyer from the list to review their credentials</p>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Review Application
                                    <StatusIndicator status={selectedLawyer.verificationStatus || 'PENDING'} />
                                </h3>

                                <DetailGroup>
                                    <label>Professional Identity</label>
                                    <div className="value"><FaEnvelope opacity={0.5} /> {selectedLawyer.email}</div>
                                </DetailGroup>

                                <DetailGroup>
                                    <label>Bar Council Identification</label>
                                    <div className="value"><FaIdCard opacity={0.5} /> {selectedLawyer.barCouncilId || 'NOT PROVIDED'}</div>
                                </DetailGroup>

                                <DetailGroup>
                                    <label>Area of Expertise</label>
                                    <div className="value"><FaGavel opacity={0.5} /> {selectedLawyer.specialization || 'General Practice'}</div>
                                </DetailGroup>

                                {selectedLawyer.rejectionReason && (
                                    <DetailGroup>
                                        <label>Previous Remarks</label>
                                        <div className="value" style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                            <FaExclamationCircle /> {selectedLawyer.rejectionReason}
                                        </div>
                                    </DetailGroup>
                                )}

                                <FormSection>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                        ADMIN MODERATION REMARKS
                                    </label>
                                    <TextArea
                                        rows="4"
                                        placeholder="Enter reason for rejection or details about missing documents..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <ActionButtonGroup>
                                        <ActionBtn variant="success" onClick={() => setConfirmModal({ isOpen: true, type: 'APPROVE', data: null })}>
                                            <FaCheckCircle /> Approve
                                        </ActionBtn>
                                        <ActionBtn variant="warning" onClick={() => handleUpdateStatus('NEEDS_INFO')}>
                                            <FaInfoCircle /> Req Info
                                        </ActionBtn>
                                        <ActionBtn variant="danger" disabled={!reason} onClick={() => handleUpdateStatus('REJECTED')}>
                                            <FaUserTimes /> Reject
                                        </ActionBtn>
                                    </ActionButtonGroup>
                                </FormSection>
                            </>
                        )}
                    </ReviewPanel>
                </Panel>
            </ContentGrid>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: '', data: null })}
                onConfirm={() => handleUpdateStatus('APPROVED')}
                title="Verify Lawyer Credentials?"
                message="By approving this application, you confirm it's a valid legal professional. They will gain immediate access to advanced AI tools and Case Predictions."
                confirmText="Verify & Approve"
                type="primary"
                icon="⚖️"
            />
        </Container>
    );
};

const StatusIndicator = ({ status }) => {
    const config = {
        PENDING: { color: '#fbbf24', text: 'Evaluation' },
        APPROVED: { color: '#10b981', text: 'Verified' },
        REJECTED: { color: '#ef4444', text: 'Denied' },
        NEEDS_INFO: { color: '#3b82f6', text: 'Clarification Req' }
    };
    const s = config[status] || config.PENDING;
    return (
        <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: `${s.color}20`, color: s.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {s.text}
        </span>
    );
};

export default LawyerManagement;
