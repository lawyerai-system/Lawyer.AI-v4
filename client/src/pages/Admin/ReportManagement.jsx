import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import { 
    FaExclamationTriangle, FaCheckCircle, FaTrash, FaUserSlash, 
    FaUserClock, FaFilter, FaEye, FaSearch 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Container = styled.div`
    padding: 2rem;
    animation: fadeIn 0.5s ease-out;
`;

const Header = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
        font-size: 2rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
`;

const FilterBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    background: var(--glass-bg);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid var(--glass-border);

    select, input {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--glass-border);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        outline: none;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
`;

const ReportCard = styled.div`
    background: var(--glass-bg);
    border: 1px solid ${props => props.status === 'Pending' ? '#ffab0040' : 'var(--glass-border)'};
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;

    &:hover { transform: translateY(-5px); border-color: var(--primary); }

    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        
        .type {
            font-size: 0.8rem;
            text-transform: uppercase;
            padding: 0.2rem 0.6rem;
            background: var(--primary-light);
            color: var(--primary);
            border-radius: 4px;
            font-weight: 600;
        }

        .date { font-size: 0.8rem; color: var(--text-secondary); }
    }

    .target {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .reason {
        color: #ff5630;
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        background: rgba(0,0,0,0.2);
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        min-height: 60px;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--glass-border);
        padding-top: 1rem;

        .reporter {
            font-size: 0.85rem;
            color: var(--text-secondary);
            span { color: var(--text-primary); }
        }
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }
`;

const ActionButton = styled.button`
    flex: 1;
    padding: 0.6rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: ${props => props.bg};
    color: white;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;

    &:hover { filter: brightness(1.2); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Badge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: ${props => props.bg}20;
    color: ${props => props.bg};
`;

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await api.get('/api/admin/reports');
            setReports(res.data.data.reports);
        } catch (err) {
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (reportId, action, status = 'Resolved') => {
        try {
            const res = await api.patch(`/api/admin/reports/${reportId}/resolve`, {
                adminAction: action,
                status: status
            });
            if (res.data.status === 'success') {
                toast.success(`Action: ${action} applied`);
                fetchReports();
            }
        } catch (err) {
            toast.error("Failed to apply action");
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesFilter = filter === 'All' || r.status === filter;
        const matchesSearch = r.targetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             r.reason.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="loading">Processing reports...</div>;

    return (
        <Container>
            <Header>
                <h1><FaExclamationTriangle /> Reports & Complaints</h1>
                <Badge bg="#ffab00">{reports.filter(r => r.status === 'Pending').length} Pending</Badge>
            </Header>

            <FilterBar>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaFilter color="var(--text-secondary)" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Dismissed">Dismissed</option>
                    </select>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        style={{ width: '100%', paddingLeft: '35px' }}
                        placeholder="Search targets or reasons..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </FilterBar>

            <Grid>
                {filteredReports.map(report => (
                    <ReportCard key={report._id} status={report.status}>
                        <div className="header">
                            <span className="type">{report.reportType}</span>
                            <span className="date">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="target">{report.targetName}</div>
                        <div className="reason">{report.reason}</div>
                        <div className="description">{report.description || 'No additional details provided.'}</div>
                        
                        <div className="footer">
                            <div className="reporter">
                                Reported by <span>{report.reporter?.name || 'User'}</span>
                            </div>
                            <Badge bg={report.status === 'Pending' ? '#ffab00' : '#36b37e'}>
                                {report.status}
                            </Badge>
                        </div>

                        {report.status === 'Pending' && (
                            <div className="actions">
                                <ActionButton bg="#ffab00" onClick={() => handleAction(report._id, 'Warned User')}>
                                    <FaUserClock /> Warn
                                </ActionButton>
                                <ActionButton bg="#ff5630" onClick={() => handleAction(report._id, report.reportType === 'User' ? 'Suspended User' : 'Removed Content')}>
                                    {report.reportType === 'User' ? <FaUserSlash /> : <FaTrash />} 
                                    {report.reportType === 'User' ? 'Suspend' : 'Remove'}
                                </ActionButton>
                                <ActionButton bg="#36b37e" onClick={() => handleAction(report._id, 'None', 'Dismissed')}>
                                    <FaCheckCircle /> Dismiss
                                </ActionButton>
                            </div>
                        )}

                        {report.status !== 'Pending' && (
                            <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(54, 179, 126, 0.1)', borderRadius: '8px', color: '#36b37e', fontSize: '0.85rem', textAlign: 'center' }}>
                                <strong>Action taken:</strong> {report.adminAction}
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Resolved by {report.resolvedBy?.name || 'Admin'}
                                </div>
                            </div>
                        )}
                    </ReportCard>
                ))}
            </Grid>

            {filteredReports.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <FaCheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>No reports found matching your criteria.</p>
                </div>
            )}
        </Container>
    );
};

export default ReportManagement;
