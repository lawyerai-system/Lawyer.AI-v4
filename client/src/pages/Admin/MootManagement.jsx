import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  color: var(--text-main);
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-panel);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid var(--border);
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

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.active ? '#10b981' : '#ef4444'};
`;

const MootManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get('/api/admin/moot-sessions');
                if (res.data.status === 'success') {
                    setSessions(res.data.data.sessions);
                }
            } catch (error) {
                console.error("Failed to fetch moot sessions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    return (
        <Container>
            <Title>Moot Court Simulation Monitoring</Title>
            {loading ? <p style={{ color: 'var(--text-secondary)' }}>Loading sessions...</p> : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Session ID</Th>
                            <Th>Student Name</Th>
                            <Th>Case Topic</Th>
                            <Th>Status</Th>
                            <Th>Date</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length === 0 ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No active moot sessions.</Td></tr>
                        ) : (
                            sessions.map(session => (
                                <tr key={session._id}>
                                    <Td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{session._id.substring(0, 8)}...</Td>
                                    <Td>{session.userId?.name || 'Anonymous'}</Td>
                                    <Td>{session.caseData?.title || 'General Practice'}</Td>
                                    <Td><StatusBadge active={session.status === 'active'}>{session.status || 'Completed'}</StatusBadge></Td>
                                    <Td>{new Date(session.createdAt).toLocaleDateString()}</Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default MootManagement;
