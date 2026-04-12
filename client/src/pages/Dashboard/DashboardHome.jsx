import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaScaleUnbalanced, FaRobot, FaBook, FaGavel, FaPenNib, FaLightbulb, 
    FaUserGraduate, FaBrain, FaScaleBalanced, FaArrowRight, FaListCheck,
    FaClock, FaChartLine, FaNewspaper, FaCirclePlay, FaFire, FaMagnifyingGlass,
    FaFileLines, FaMicrochip, FaComments
} from 'react-icons/fa6';
import api from '../../utils/axios';
import { toast } from 'react-hot-toast';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scrollText = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

// Styled Components
const Container = styled.div`
  width: 100%;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
  padding-bottom: 4rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// --- Components ---

const NewsWidget = styled.div`
  background: rgba(25, 195, 125, 0.05);
  border: 1px solid rgba(25, 195, 125, 0.1);
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const NewsLabel = styled.div`
  background: rgba(25, 195, 125, 0.1);
  color: #19c37d;
  padding: 0.6rem 1.2rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsMarquee = styled.div`
  padding: 0.6rem 0;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  display: flex;
  
  .ticker-track {
    display: inline-block;
    animation: ${scrollText} 40s linear infinite;
    padding-left: 100%;
  }

  span {
    display: inline-block;
    color: var(--text-secondary);
    margin-right: 50px;
    font-size: 0.9rem;
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  
  .welcome-text {
    h1 {
      font-size: 2.2rem;
      margin: 0;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #a0a3bd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      margin: 0.5rem 0 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }
  }

  .user-badge {
    text-align: right;
    .role {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: rgba(108, 93, 211, 0.1);
      color: var(--primary);
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
    .last-login {
      display: block;
      font-size: 0.8rem;
      color: var(--text-secondary);
      opacity: 0.6;
    }
  }
`;

const Widget = styled.div `
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const WidgetTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #fff;
  
  svg {
    color: var(--primary);
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ActionBtn = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  text-decoration: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);

  .icon-wrap {
    width: 45px;
    height: 45px;
    background: rgba(108, 93, 211, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: var(--primary);
    transition: all 0.3s;
  }

  span {
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
  }

  &:hover {
    background: rgba(108, 93, 211, 0.15);
    border-color: var(--primary);
    transform: translateY(-5px);
    .icon-wrap { 
        background: var(--primary);
        color: white;
        transform: scale(1.1); 
    }
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px rgba(108, 93, 211, 0.2);
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  
  &:last-child {
    border-bottom: none;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 10px var(--primary);
  }

  .content {
    flex: 1;
    .feature {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
    }
    .time {
      font-size: 0.75rem;
      color: var(--text-secondary);
      opacity: 0.6;
    }
  }

  .status {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    background: rgba(25, 195, 125, 0.1);
    color: #19c37d;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 800;
  }
`;

const ResumeCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem;
  background: linear-gradient(90deg, rgba(108, 93, 211, 0.15) 0%, rgba(25, 195, 125, 0.05) 100%);
  border: 1px solid rgba(108, 93, 211, 0.2);
  border-radius: 18px;
  text-decoration: none;
  color: #fff;
  margin-top: 1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
    border-color: var(--primary);
  }

  .play-icon {
    font-size: 1.8rem;
    color: var(--primary);
  }

  .info {
    flex: 1;
    h4 { margin: 0; font-size: 0.95rem; }
    p { margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--text-secondary); }
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const MiniStat = styled.div`
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.03);

  .val {
    display: block;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--primary);
  }
  .lab {
    font-size: 0.7rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.2rem;
  }
`;

const InsightCard = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  margin-bottom: 1rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #fff;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .meta {
    margin-top: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--primary);
  }
`;

const RecommendationWidget = styled(Widget)`
  background: linear-gradient(135deg, rgba(108, 93, 211, 0.1) 0%, rgba(25, 195, 125, 0.05) 100%);
  border: 1px solid rgba(108, 93, 211, 0.2);
`;

const RecItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  .num {
    width: 24px;
    height: 24px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.4;
    color: var(--text-secondary);
  }
`;

const DashboardHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/dashboard/stats');
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats', err);
                toast.error('Failed to load personalized dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const recommendations = {
        civilian: [
            "Use 'Legal AI Chat' to understand your basic rights regarding property disputes.",
            "Check the IPC Dictionary to learn about cybercrime laws in India.",
            "Analyze your rental agreement using our 'Document Analyzer' before signing."
        ],
        law_student: [
            "Practice a 'Beginner' level Moot Court trial to improve your courtroom presence.",
            "Use the 'Strategy Generator' to build a defense for our weekly mock case.",
            "Read recent legal blogs to stay updated on Supreme Court landmark judgments."
        ],
        lawyer: [
            "Write a blog post about the new Digital Personal Data Protection Act to increase your reach.",
            "Use 'Strategy Generator' for complex litigation planning and precedent search.",
            "Simulate a high-stakes cross-examination in the 'Moot Court Simulator'."
        ]
    };

    const getRolePrefix = () => {
        if (!user) return '/dashboard';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'lawyer') return '/lawyer';
        if (user.role === 'law_student') return '/student';
        if (user.role === 'civilian') return '/civilian';
        return '/dashboard';
    };

    const resolvePath = (path) => {
        return `${getRolePrefix()}${path}`;
    };

    const currentRecs = recommendations[user?.role] || recommendations.civilian;

    const newsItems = [
        "New IPC Amendment (2024) Passed - Key changes in Section 377",
        "Supreme Court Guidelines on Digital Privacy & Data Protection",
        "Bar Council of India announces new registration norms for 2025",
        "AI Regulation Bill proposed in upcoming parliament session",
        "Landmark judgment on Property Rights for Daughters summarized"
    ];

    const [searchTerm, setSearchTerm] = React.useState('');

    const allTools = [
        { title: "Legal AI Chat", path: "/chat", icon: <FaRobot />, category: "research", roles: ["lawyer", "law_student", "civilian", "admin"], keywords: "ai chat legal help assistant" },
        { title: "IPC Finder", path: "/ipc", icon: <FaBook />, category: "research", roles: ["lawyer", "law_student", "civilian", "admin"], keywords: "ipc law section indian penal code search" },
        { title: "Doc Analyzer", path: "/doc-analyzer", icon: <FaFileLines />, category: "research", roles: ["lawyer", "law_student", "admin"], keywords: "document analysis contracts risk" },
        { title: "Case Builder", path: "/case-builder", icon: <FaListCheck />, category: "practice", roles: ["lawyer", "law_student", "admin"], keywords: "case preparation evidence structure" },
        { title: "Strategy Generator", path: "/strategy-generator", icon: <FaBrain />, category: "practice", roles: ["lawyer", "law_student", "admin"], keywords: "strategy legal advice arguments" },
        { title: "Outcome Predictor", path: "/outcome-predictor", icon: <FaGavel />, category: "practice", roles: ["lawyer", "admin"], keywords: "predict success win rate analysis" },
        { title: "Judicial Simulation", path: "/judicial-simulation", icon: <FaMicrochip />, category: "practice", roles: ["lawyer", "admin"], keywords: "judge simulation perspective court" },
        { title: "Moot Court", path: "/moot-court", icon: <FaUserGraduate />, category: "academy", roles: ["law_student", "admin", "lawyer"], keywords: "trial practice advocacy student" },
        { title: "Case Library", path: "/case-library", icon: <FaScaleBalanced />, category: "academy", roles: ["lawyer", "law_student", "admin"], keywords: "library precedents judgments research" },
        { title: "Virtual Courtroom", path: "/courtroom", icon: <FaComments />, category: "community", roles: ["lawyer", "law_student", "civilian", "admin"], keywords: "courtroom discussion community collaborate" },
        { title: "Legal Blog", path: "/blog", icon: <FaNewspaper />, category: "community", roles: ["lawyer", "law_student", "admin"], keywords: "blog news insights legal" },
    ];

    const filteredTools = allTools.filter(tool => {
        const matchesRole = tool.roles.includes(user?.role);
        const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tool.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             tool.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    if (loading) {
        return (
            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <FaRobot size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Configuring your personalized dashboard...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            {/* News Ticker */}
            <NewsWidget>
                <NewsLabel><FaFire /> Highlights:</NewsLabel>
                <NewsMarquee>
                    <div className="ticker-track">
                        {newsItems.map((item, i) => (
                            <span key={i}>• {item}</span>
                        ))}
                    </div>
                </NewsMarquee>
            </NewsWidget>

            {/* Personalized Header */}
            <WelcomeHeader>
                <div className="welcome-text">
                    <h1>Welcome Back, {(user?.name || 'User').split(' ')[0]}!</h1>
                    <p>Your legal command center is ready. Here's what's happening today.</p>
                </div>
                <div className="user-badge">
                    <span className="role">{(user?.role || 'user').replace('_', ' ')}</span>
                    <span className="last-login">
                        Last Active: {new Date(stats?.user?.lastLogin || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </WelcomeHeader>

            <DashboardGrid>
                <MainContent>
                    {/* Smart Shortcuts with Search */}
                    <Widget>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <WidgetTitle style={{ marginBottom: 0 }}><FaCirclePlay /> Smart Shortcuts</WidgetTitle>
                            <div style={{ position: 'relative', flex: '1', maxWidth: '300px' }}>
                                <FaMagnifyingGlass style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '0.9rem' }} />
                                <SearchInput 
                                    type="text" 
                                    placeholder="Find a tool (e.g. 'strategy', 'ipc')..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <QuickActionsGrid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                            {searchTerm ? (
                                // Show Searched Tools
                                filteredTools.length > 0 ? (
                                    filteredTools.map((tool, i) => (
                                        <ActionBtn key={i} to={resolvePath(tool.path)}>
                                            <div className="icon-wrap">{tool.icon}</div>
                                            <span>{tool.title}</span>
                                        </ActionBtn>
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                        No tools found matching "{searchTerm}"
                                    </div>
                                )
                            ) : (
                                // Show Default Top Shortcuts (Legacy logic)
                                <>
                                    {user?.role === 'lawyer' && (
                                        <>
                                            <ActionBtn to={resolvePath('/strategy-generator')}>
                                                <div className="icon-wrap" style={{ background: 'var(--accent)' }}><FaBrain /></div>
                                                <span>Build Case Strategy</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/outcome-predictor')}>
                                                <div className="icon-wrap" style={{ background: 'var(--success)' }}><FaGavel /></div>
                                                <span>Predict Outcome</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/case-builder')}>
                                                <div className="icon-wrap"><FaListCheck /></div>
                                                <span>Evidence Builder</span>
                                            </ActionBtn>
                                        </>
                                    )}

                                    {user?.role === 'law_student' && (
                                        <>
                                            <ActionBtn to={resolvePath('/moot-court')}>
                                                <div className="icon-wrap" style={{ background: 'var(--accent)' }}><FaUserGraduate /></div>
                                                <span>Launch Moot Trial</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/case-library')}>
                                                <div className="icon-wrap" style={{ background: 'var(--info)' }}><FaScaleBalanced /></div>
                                                <span>Legal Precedents</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/strategy-generator')}>
                                                <div className="icon-wrap"><FaBrain /></div>
                                                <span>Draft Strategy</span>
                                            </ActionBtn>
                                        </>
                                    )}

                                    {user?.role === 'civilian' && (
                                        <>
                                            <ActionBtn to={resolvePath('/chat')}>
                                                <div className="icon-wrap" style={{ background: 'var(--accent)' }}><FaRobot /></div>
                                                <span>Ask AI Lawyer</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/ipc')}>
                                                <div className="icon-wrap" style={{ background: 'var(--info)' }}><FaBook /></div>
                                                <span>Search IPC Laws</span>
                                            </ActionBtn>
                                            <ActionBtn to={resolvePath('/courtroom')}>
                                                <div className="icon-wrap"><FaComments /></div>
                                                <span>Join Courtroom</span>
                                            </ActionBtn>
                                        </>
                                    )}

                                    {/* Default AI Assistant for Pros */}
                                    {user?.role !== 'civilian' && (
                                        <ActionBtn to={resolvePath('/chat')}>
                                            <div className="icon-wrap"><FaRobot /></div>
                                            <span>AI Assistant</span>
                                        </ActionBtn>
                                    )}
                                </>
                            )}
                        </QuickActionsGrid>
                    </Widget>

                    {/* Recommendations */}
                    <RecommendationWidget>
                        <WidgetTitle><FaLightbulb /> Recommended for You</WidgetTitle>
                        {currentRecs.map((rec, i) => (
                            <RecItem key={i}>
                                <div className="num">{i + 1}</div>
                                <p>{rec}</p>
                            </RecItem>
                        ))}
                    </RecommendationWidget>

                    {/* Role-Based Widgets */}
                    <Widget>
                        <WidgetTitle><FaChartLine /> My Performance & Stats</WidgetTitle>
                        <StatGrid>
                            {user?.role === 'lawyer' && (
                                <>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.blogCount || 0}</span>
                                        <span className="lab">Published Blogs</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.blogViews || 0}</span>
                                        <span className="lab">Total Reach</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.strategyUsage || 0}</span>
                                        <span className="lab">Strategies Built</span>
                                    </MiniStat>
                                </>
                            )}
                            {user?.role === 'law_student' && (
                                <>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.completedMoots || 0}</span>
                                        <span className="lab">Trials Done</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.averageMootScore || 0}/10</span>
                                        <span className="lab">Avg Score</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.strategyUsage || 0}</span>
                                        <span className="lab">Strategies Generated</span>
                                    </MiniStat>
                                </>
                            )}
                            {user?.role === 'civilian' && (
                                <>
                                    <MiniStat>
                                        <span className="val">{stats?.roleStats?.aiHelpUsage || 0}</span>
                                        <span className="lab">Help Requests</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">100%</span>
                                        <span className="lab">Data Privacy</span>
                                    </MiniStat>
                                    <MiniStat>
                                        <span className="val">AI</span>
                                        <span className="lab">Status Ready</span>
                                    </MiniStat>
                                </>
                            )}
                        </StatGrid>
                    </Widget>

                    {/* Continue Where You Left Off */}
                    {stats?.resumeActivity && (
                        <Widget>
                            <WidgetTitle><FaClock /> Resume Previous Activity</WidgetTitle>
                            <ResumeCard to="/dashboard/moot-court">
                                <div className="play-icon"><FaCirclePlay /></div>
                                <div className="info">
                                    <h4>{stats.resumeActivity.caseDetails.title}</h4>
                                    <p>Continue your active Moot Court session • Last active {new Date(stats.resumeActivity.updatedAt).toLocaleDateString()}</p>
                                </div>
                                <FaArrowRight style={{ opacity: 0.4 }} />
                            </ResumeCard>
                        </Widget>
                    )}
                </MainContent>

                <Sidebar>
                    {/* Recent Activity */}
                    <Widget>
                        <WidgetTitle><FaClock /> Recent Activity</WidgetTitle>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {stats?.recentActivity?.length > 0 ? (
                                stats.recentActivity.map((log, i) => (
                                    <ActivityItem key={i}>
                                        <div className="indicator" />
                                        <div className="content">
                                            <span className="feature">{log.feature}</span>
                                            <span className="time">{new Date(log.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="status">{log.status}</div>
                                    </ActivityItem>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                                    No recent activity found. Start exploring!
                                </p>
                            )}
                        </div>
                    </Widget>

                    {/* Platform Insights */}
                    <Widget>
                        <WidgetTitle><FaNewspaper /> Platform Insights</WidgetTitle>
                        
                        <InsightCard>
                            <h4>Latest Publication</h4>
                            <p>{stats?.platformInsights?.latestBlog?.title || 'No recent blogs'}</p>
                            <div className="meta">
                                <span>Read Insight</span>
                                <Link to="/dashboard/blog" style={{ color: 'var(--primary)' }}><FaArrowRight size={12} /></Link>
                            </div>
                        </InsightCard>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats?.platformInsights?.totalCases || 0}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Library Cases</span>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats?.platformInsights?.activeMootTrials || 0}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Trials</span>
                            </div>
                        </div>
                    </Widget>
                </Sidebar>
            </DashboardGrid>

            {/* Existing Sections Re-styled or Moved to categories below if needed */}
            {/* Keeping it clean as requested, prioritizing new personalized widgets */}
            
        </Container>
    );
};

export default DashboardHome;
