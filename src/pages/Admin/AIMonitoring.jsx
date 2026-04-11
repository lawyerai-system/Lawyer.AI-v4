import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../../utils/axios';
import {
    FaRobot, FaChartLine, FaExclamationTriangle, FaClock,
    FaCheckCircle, FaExclamationCircle, FaSearch, FaFilter
} from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const COLORS = ['#6c5dd3', '#00b8d9', '#ffab00', '#ff5630', '#36b37e', '#253858'];

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
    padding: 1rem;
    animation: fadeIn 0.5s ease-out;

    @media (min-width: 640px) {
        padding: 2rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(108, 93, 211, 0.1);
        border-top: 3px solid #6c5dd3;
        border-radius: 50%;
        animation: ${rotate} 1s linear infinite;
    }
`;

const Header = styled.div`
    margin-bottom: 2rem;
    h1 {
        font-size: 1.5rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 1rem;

        @media (min-width: 640px) {
            font-size: 2rem;
        }
    }
    p { 
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
    }
`;

const StatCard = styled.div`
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (min-width: 640px) {
        padding: 1.5rem;
    }

    .icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: ${props => props.color}20;
        color: ${props => props.color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;

        @media (min-width: 640px) {
            width: 48px;
            height: 48px;
            font-size: 1.5rem;
        }
    }

    .info {
        h3 { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.1rem; }
        p { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }

        @media (min-width: 640px) {
            h3 { font-size: 0.9rem; }
            p { font-size: 1.5rem; }
        }
    }
`;

const ChartsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const Card = styled.div`
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 1.25rem;

    @media (min-width: 640px) {
        padding: 1.5rem;
    }

    h2 {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        @media (min-width: 640px) {
            font-size: 1.2rem;
        }
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
    margin-top: 1rem;
    min-width: 600px;

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--glass-border);
    }

    th { color: var(--text-secondary); font-weight: 500; font-size: 0.9rem; }
    td { color: var(--text-primary); font-size: 0.9rem; }

    tr:hover { background: rgba(255,255,255,0.02); }

    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        &.error { background: rgba(255, 86, 48, 0.1); color: #ff5630; }
        &.success { background: rgba(54, 179, 126, 0.1); color: #36b37e; }
    }
`;

const ErrorSummary = styled.div`
    background: rgba(255, 86, 48, 0.05);
    border: 1px solid rgba(255, 86, 48, 0.1);
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;
    
    .error-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
        &:last-child { margin-bottom: 0; }
        .feature { font-weight: 600; color: #ff5630; }
        .msg { color: var(--text-secondary); }
    }
`;

const AIMonitoring = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/admin/ai-monitoring');
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="spinner"></div>
            </div>
        </Container>
    );

    if (!data) return (
        <Container>
            <Card>
                <h2>No AI Logs Found</h2>
                <p>Start using AI features to see monitoring data here.</p>
            </Card>
        </Container>
    );

    const {
        dailyUsage = [],
        featureDistribution = [],
        performance = { avgLatency: 0, totalRequests: 0, errorRate: 0 },
        errorLogs = []
    } = data;

    return (
        <Container>
            <Header>
                <h1><FaRobot /> AI Usage Monitoring</h1>
                <p>Track real-time performance, usage trends, and reliability of LawAI features.</p>
            </Header>

            <StatsGrid>
                <StatCard color="#6c5dd3">
                    <div className="icon"><FaChartLine /></div>
                    <div className="info">
                        <h3>Total Requests</h3>
                        <p>{performance.totalRequests}</p>
                    </div>
                </StatCard>
                <StatCard color="#36b37e">
                    <div className="icon"><FaClock /></div>
                    <div className="info">
                        <h3>Avg Latency</h3>
                        <p>{Math.round(performance.avgLatency)}ms</p>
                    </div>
                </StatCard>
                <StatCard color="#ffab00">
                    <div className="icon"><FaExclamationTriangle /></div>
                    <div className="info">
                        <h3>Error Rate</h3>
                        <p>{(performance.errorRate * 100).toFixed(1)}%</p>
                    </div>
                </StatCard>
                <StatCard color="#00b8d9">
                    <div className="icon"><FaCheckCircle /></div>
                    <div className="info">
                        <h3>Most Active</h3>
                        <p>{featureDistribution[0]?._id || 'N/A'}</p>
                    </div>
                </StatCard>
            </StatsGrid>

            <ChartsGrid>
                <Card>
                    <h2><FaChartLine /> Daily Request Volume</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={dailyUsage}>
                                <defs>
                                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6c5dd3" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6c5dd3" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="_id" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1d24', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#6c5dd3" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={3} />
                                <Area type="monotone" dataKey="errors" stroke="#ff5630" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h2><FaClock /> Feature Performance (Latency)</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={featureDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="_id" stroke="var(--text-secondary)" fontSize={10} interval={0} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1d24', border: 'none', borderRadius: '12px' }}
                                />
                                <Bar dataKey="avgResponseTime" name="Avg Latency (ms)" radius={[6, 6, 0, 0]}>
                                    {featureDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h2><FaFilter /> Feature Distribution</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={featureDistribution}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {featureDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#1a1d24', border: 'none', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </ChartsGrid>

            <Card>
                <h2><FaExclamationCircle /> Recent AI Error Logs</h2>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Error Message</th>
                                <th>User</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errorLogs.map((log, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{log.feature}</td>
                                    <td style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px' }}>{log.errorMessage}</td>
                                    <td>{log.userId?.name || 'Anonymous'}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td><span className="status error">FAILED</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            </Card>
        </Container>
    );
};

export default AIMonitoring;
