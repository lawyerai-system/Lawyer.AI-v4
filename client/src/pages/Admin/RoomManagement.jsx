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
  background: ${props => props.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.online ? '#10b981' : '#ef4444'};
`;

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/api/admin/rooms');
                if (res.data.status === 'success') {
                    setRooms(res.data.data.rooms);
                }
            } catch (error) {
                console.error("Failed to fetch rooms", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <Container>
            <Title>Active Justice Rooms (Consultations)</Title>
            {loading ? <p style={{ color: 'var(--text-secondary)' }}>Monitoring encrypted channels...</p> : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Room Code</Th>
                            <Th>Lawyer</Th>
                            <Th>Client/Civilian</Th>
                            <Th>Status</Th>
                            <Th>Last Activity</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length === 0 ? (
                            <tr><Td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No active consultation rooms found.</Td></tr>
                        ) : (
                            rooms.map(room => (
                                <tr key={room._id}>
                                    <Td style={{ fontWeight: '700', color: 'var(--primary)' }}>{room.roomCode}</Td>
                                    <Td>{room.lawyerId?.name || 'Assigned Lawyer'}</Td>
                                    <Td>{room.civilianId?.name || 'Assigned Civilian'}</Td>
                                    <Td><StatusBadge online={true}>ACTIVE</StatusBadge></Td>
                                    <Td>{new Date(room.updatedAt).toLocaleString()}</Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default RoomManagement;
