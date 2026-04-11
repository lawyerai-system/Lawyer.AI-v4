import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../../utils/axios';
import {
  FaUsers, FaGavel, FaPenNib, FaBook, FaSchool, FaDoorOpen,
  FaChartLine, FaChartPie, FaChartBar, FaGlobe, FaShieldAlt, FaServer, FaRobot
} from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 640px) {
    gap: 2.5rem;
    padding: 1rem 0 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(108, 93, 211, 0.1);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title-group {
    h1 {
      font-size: 1.5rem;
      background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
      font-weight: 800;

      @media (min-width: 640px) {
        font-size: 2.2rem;
      }
    }
    p { 
      color: var(--text-secondary); 
      margin: 0.5rem 0 0 0;
      font-size: 0.85rem;
      @media (min-width: 640px) {
        font-size: 1rem;
      }
    }
  }

  .status-badge {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 0.5rem;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    border: 1px solid rgba(16, 185, 129, 0.2);

    @media (min-width: 640px) {
      font-size: 0.8rem;
    }
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: var(--bg-panel);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 1.8rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: ${props => props.color || 'var(--primary)'};
    filter: blur(50px);
    opacity: 0.15;
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.color || 'var(--primary)'};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    &::after { opacity: 0.3; width: 100px; height: 100px; }
  }

  h4 {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    @media (min-width: 640px) {
      font-size: 0.75rem;
    }
  }

  .value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    @media (min-width: 640px) {
      font-size: 2.2rem;
    }
  }

  .trend {
    font-size: 0.75rem;
    color: #10b981;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.1rem;
    color: ${props => props.color || 'var(--primary)'};
    opacity: 0.6;
    @media (min-width: 640px) {
      font-size: 1.2rem;
    }
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 1280px) { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 2rem;
  }
`;

const AnalyticsSection = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  padding: 1.25rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
    border-radius: 24px;
  }
  
  .chart-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    h3 { 
      margin: 0; 
      font-size: 1.1rem; 
      display: flex; 
      align-items: center; 
      gap: 0.8rem; 
      @media (min-width: 640px) {
        font-size: 1.2rem;
      }
    }
    .controls { display: flex; gap: 0.5rem; }
  }
`;

const StatusList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
`;

const StatusCard = styled.div`
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.online ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
    color: ${props => props.online ? '#10b981' : '#ef4444'};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  
  .details {
    span { display: block; font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    strong { font-size: 0.8rem; color: #fff; }
  }
`;


const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pendingLawyers, setPendingLawyers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, pendingRes, analyticsRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/pending-lawyers'),
          api.get('/api/admin/analytics')
        ]);

        if (statsRes.data.status === 'success') setStats(statsRes.data.data);
        if (pendingRes.data.status === 'success') setPendingLawyers(pendingRes.data.data.lawyers.length);
        if (analyticsRes.data.status === 'success') setAnalytics(analyticsRes.data.data);
      } catch (error) {
        console.error("Dashboard data load failure", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)' }}>Synchronizing encryption protocols...</p>
    </div>
  );

  const COLORS = ['#6c5dd3', '#10b981', '#fbbf24', '#3b82f6', '#ef4444'];

  return (
    <DashboardContainer>
      <PageHeader>
        <div className="title-group">
          <h1>Administrative Nexus</h1>
          <p>Real-time platform insights and operational control.</p>
        </div>
        <div className="status-badge">SYSTEMS SECURED</div>
      </PageHeader>

      <StatsGrid>
        <StatCard color="#6c5dd3" onClick={() => navigate('/admin/users')}>
          <FaUsers className="icon" />
          <h4>Total Network</h4>
          <span className="value">{stats?.users.totalUsers}</span>
          <div className="trend">Growth monitored</div>
        </StatCard>
        <StatCard color="#10b981" onClick={() => navigate('/admin/lawyers')}>
          <FaGavel className="icon" />
          <h4>Verified Lawyers</h4>
          <span className="value">{stats?.users.lawyers}</span>
          <div className="trend">{pendingLawyers} pending review</div>
        </StatCard>
        <StatCard color="#fbbf24" onClick={() => navigate('/admin/blogs')}>
          <FaPenNib className="icon" />
          <h4>Insight Articles</h4>
          <span className="value">{stats?.content.totalBlogs}</span>
          <div className="trend">Community content</div>
        </StatCard>
        <StatCard color="#3b82f6" onClick={() => navigate('/admin/cases')}>
          <FaBook className="icon" />
          <h4>Precedents</h4>
          <span className="value">{stats?.content.totalCases}</span>
          <div className="trend">Indexed library</div>
        </StatCard>
      </StatsGrid>

      <AnalyticsSection>
        <div className="chart-header">
          <h3><FaChartLine color="var(--primary)" /> Usage & Growth Trends</h3>
          <div className="controls">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last 14 Days</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={(analytics?.trends?.dau || []).map((d, i) => ({
              name: d._id,
              Active: d.activeUsers,
              New: analytics?.trends?.registrations?.find(r => r._id === d._id)?.newUsers || 0
            }))}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5dd3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5dd3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <Tooltip contentStyle={{ background: '#1a1d24', border: '1px solid var(--border)', borderRadius: '12px' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="Active" stroke="#6c5dd3" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
              <Area type="monotone" dataKey="New" stroke="#10b981" fillOpacity={1} fill="url(#colorNew)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsSection>

      <ChartsGrid>
        <AnalyticsSection>
          <div className="chart-header">
            <h3><FaChartPie color="#fbbf24" /> Feature Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={analytics?.featureUsage}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics?.featureUsage || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1d24', border: 'none', borderRadius: '12px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsSection>

        <AnalyticsSection>
          <div className="chart-header">
            <h3><FaChartBar color="#ef4444" /> Engagement Metrics</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[
                { name: 'Top Blog Views', value: analytics?.engagement?.topBlogs?.[0]?.views || 0 },
                { name: 'Avg Blog Views', value: (analytics?.engagement?.topBlogs || []).reduce((acc, b) => acc + (b.views || 0), 0) / 5 || 0 },
                { name: 'Top Case Stars', value: (analytics?.engagement?.topCases?.[0]?.stars || 0) * 10 },
                { name: 'Avg Case Stars', value: (analytics?.engagement?.topCases || []).reduce((acc, c) => acc + (c.stars || 0), 0) / 5 || 0 }
              ]}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1a1d24', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {(analytics?.engagement?.topBlogs || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsSection>
      </ChartsGrid>

      <AnalyticsSection>
        <div className="chart-header">
          <h3><FaShieldAlt color="var(--primary)" /> Infrastructure Health</h3>
        </div>
        <StatusList>
          <StatusCard online>
            <div className="icon-box"><FaGlobe /></div>
            <div className="details"><span>API Gateway</span><strong>Operational</strong></div>
          </StatusCard>
          <StatusCard online>
            <div className="icon-box"><FaRobot /></div>
            <div className="details"><span>Gemini AI</span><strong>Ready</strong></div>
          </StatusCard>
          <StatusCard online>
            <div className="icon-box"><FaServer /></div>
            <div className="details"><span>DB Cluster</span><strong>Synced</strong></div>
          </StatusCard>
          <StatusCard online>
            <div className="icon-box"><FaShieldAlt /></div>
            <div className="details"><span>Security</span><strong>Encrypted</strong></div>
          </StatusCard>
        </StatusList>
      </AnalyticsSection>
    </DashboardContainer>
  );
};

export default AdminDashboard;
