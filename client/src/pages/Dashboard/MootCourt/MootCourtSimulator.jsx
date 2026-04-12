import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import {
    FaGavel, FaScaleUnbalanced, FaUserTie, FaUserGraduate,
    FaPaperPlane, FaXmark, FaRobot, FaCircleInfo, FaStar,
    FaBuildingColumns, FaShieldHalved, FaTriangleExclamation,
    FaFileContract, FaUserCheck, FaScaleBalanced, FaClockRotateLeft,
    FaChevronRight, FaArrowLeft, FaChartLine
} from 'react-icons/fa6';
import api from '../../../utils/axios';
import toast from 'react-hot-toast';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
  position: relative;
  min-height: calc(100vh - 80px); /* Adjust for navbar */
  background: #0b0d14;
`;

// --- TOP SECTION ---
const TopHeader = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem 2rem;
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const HeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg { color: var(--primary); }
`;

// --- MIDDLE SECTION ---
const CourtroomBody = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  flex: 1;
  overflow: hidden; /* Main page scrolls, but this area might be large */
  background: radial-gradient(circle at center, rgba(108, 93, 211, 0.03) 0%, transparent 70%);

  @media (max-width: 1200px) {
    grid-template-columns: 280px 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-left: ${props => props.$left ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'};
  border-right: ${props => props.$left ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'};
  display: flex;
  flex-direction: column;
  height: 600px; /* Fixed height for panels during simulation */
`;

const PanelHeader = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const PanelScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
`;

const DebateCenter = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const ChatWindow = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  line-height: 1.6;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.3s ease-out;

  ${props => props.$sender === 'User' ? `
    align-self: flex-end;
    background: linear-gradient(135deg, #6c5dd3 0%, #8f85f2 100%);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(108, 93, 211, 0.2);
  ` : `
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-left-radius: 4px;
  `}

  .sender-name {
    display: block;
    font-weight: 800;
    margin-bottom: 0.4rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${props => props.$sender === 'User' ? 'rgba(255,255,255,0.8)' : 'var(--primary)'};
  }
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }
  
  span {
    background: #161a26;
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    color: #8e8ea0;
    font-weight: 600;
    z-index: 1;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  color: ${props => props.$user ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)'};
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  font-weight: 500;
`;

const JudgeCard = styled.div`
  background: rgba(255, 215, 0, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.15);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #FFD700;
    border-radius: 3px 0 0 3px;
  }
`;

const EvidenceItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.85rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.75rem;

  svg { color: var(--primary); flex-shrink: 0; margin-top: 0.2rem; }
`;

// --- BOTTOM SECTION ---
const ControlBar = styled.div`
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.25rem;
  color: white;
  resize: none;
  height: 80px;
  font-family: inherit;
  transition: all 0.2s;
  &:focus { outline: none; border-color: var(--primary); background: rgba(255, 255, 255, 0.06); }
  &::placeholder { color: rgba(255,255,255,0.3); }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s;
  border: none;

  ${props => props.$type === 'submit' ? `
    background: var(--primary);
    color: white;
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  ` : props.$type === 'objection' ? `
    background: rgba(255, 118, 117, 0.1);
    color: #ff7675;
    border: 1px solid rgba(255, 118, 117, 0.2);
    &:hover { background: rgba(255, 118, 117, 0.2); }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover { background: rgba(255, 255, 255, 0.1); }
  `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

// --- LEGACY/WRAPPER STYLES ---
const SetupOverlay = styled.div`
  width: 100%;
  background: #0b0d14;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 2rem;
  min-height: 80vh;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 32px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
`;

const SelectButton = styled.button`
  background: ${props => props.$active ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  &:hover { background: ${props => props.$active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}; }
  svg { font-size: 1.5rem; }
  span { font-weight: 600; }
`;

const LevelGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const LevelTag = styled.button`
  background: ${props => props.$active ? 'var(--primary)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #6c5dd3 0%, #8f85f2 100%);
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; }
`;

const EvaluationView = styled.div`
  width: 100%;
  background: #0b0d14;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
`;

const EvalCard = styled.div`
  max-width: 900px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem;
`;

const ScoreSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  .circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 6px solid var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 900;
    margin: 0 auto 1.5rem;
    background: rgba(108, 93, 211, 0.1);
    box-shadow: 0 0 30px rgba(108, 93, 211, 0.2);
  }

  h2 { font-size: 2rem; margin-bottom: 0.5rem; }
  p { color: var(--text-secondary); }
`;

const FeedbackGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FeedbackBox = styled.div`
  background: ${props => props.$type === 'strength' ? 'rgba(25, 195, 125, 0.05)' : 'rgba(255, 118, 117, 0.05)'};
  border: 1px solid ${props => props.$type === 'strength' ? 'rgba(25, 195, 125, 0.2)' : 'rgba(255, 118, 117, 0.2)'};
  padding: 1.5rem;
  border-radius: 20px;

  h4 {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
    color: ${props => props.$type === 'strength' ? '#19c37d' : '#ff7675'};
  }

  p { font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); }
`;

const MootCourtSimulator = () => {
    const [step, setStep] = useState('setup'); // setup, case_preview, simulation, results
    const [role, setRole] = useState('Prosecutor');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [session, setSession] = useState(null);
    const [userMessage, setUserMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedHistorySession, setSelectedHistorySession] = useState(null);
    const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (step === 'simulation') {
            scrollToBottom();
        }
    }, [session?.messages, step]);

    const handleStart = async () => {
        setTyping(true);
        setError(null);
        try {
            const res = await api.post('/api/moot-court/start', { role, difficulty });
            setSession(res.data.data);
            setStep('case_preview');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to generate case. Please try again.');
        } finally {
            setTyping(false);
        }
    };

    const handleSendMessage = async (isObjection = false) => {
        if (!userMessage.trim() && !isObjection) return;

        const currentMsg = isObjection ? `[OBJECTION]: ${userMessage.trim() || "I object to this line of questioning."}` : userMessage;
        setUserMessage('');

        // Optimistic update
        setSession(prev => ({
            ...prev,
            messages: [...prev.messages, { sender: 'User', content: currentMsg, timestamp: new Date().toISOString() }]
        }));

        setTyping(true);
        try {
            const res = await api.post('/api/moot-court/message', {
                sessionId: session._id,
                message: currentMsg,
                isObjection
            });

            // The backend returns an array of messages
            const newMessages = res.data.data.map(m => ({
                ...m,
                timestamp: m.timestamp || new Date().toISOString()
            }));

            setSession(prev => ({
                ...prev,
                messages: [...prev.messages, ...newMessages]
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to send argument. Please try again.");
        } finally {
            setTyping(false);
        }
    };

    const handleEndSession = () => {
        setShowConfirmModal(true);
    };

    const confirmConclude = async () => {
        setShowConfirmModal(false);
        setTyping(true);
        try {
            const res = await api.post('/api/moot-court/end', { sessionId: session._id });
            setSession(prev => ({
                ...prev,
                status: 'completed',
                evaluation: res.data.data
            }));
            setStep('results');
        } catch (err) {
            console.error(err);
            toast.error("Failed to evaluate session.");
        } finally {
            setTyping(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/api/moot-court/history');
            setHistory(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch trial history.");
        }
    };

    const fetchSessionDetails = async (id) => {
        setTyping(true);
        try {
            const res = await api.get(`/api/moot-court/${id}`);
            setSelectedHistorySession(res.data.data);
            setStep('history_details');
        } catch (err) {
            console.error(err);
            toast.error("Failed to load session details.");
        } finally {
            setTyping(false);
        }
    };

    const runPerformanceAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
            const res = await api.get('/api/moot-court/analysis');
            setPerformanceAnalysis(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to analyze performance.");
        } finally {
            setLoadingAnalysis(false);
        }
    };

    useEffect(() => {
        if (step === 'history') {
            fetchHistory();
        }
    }, [step]);

    // Filter messages for panels
    const judgeMessages = session?.messages?.filter(m => m.sender === 'AI Judge') || [];
    const debateMessages = session?.messages?.filter(m => m.sender !== 'AI Judge') || [];

    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateLabel = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (step === 'results') {
        return (
            <EvaluationView>
                <div style={{ maxWidth: '900px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <ActionButton onClick={() => setStep('setup')}>Active Simulation</ActionButton>
                        <ActionButton onClick={() => setStep('history')} $type="submit">View All Trial History</ActionButton>
                    </div>
                    <EvalCard>
                        <ScoreSection>
                            <div className="circle">{session?.evaluation?.score}</div>
                            <h2>Trial Performance Review</h2>
                            <p>Detailed analysis of your courtroom performance as {role}</p>
                        </ScoreSection>

                        <FeedbackGrid>
                            <FeedbackBox $type="strength">
                                <h4><FaUserCheck /> Key Strengths</h4>
                                <p>{session?.evaluation?.ipcUse || "Strong focus on relevant IPC sections and legal reasoning."}</p>
                            </FeedbackBox>
                            <FeedbackBox $type="improvement">
                                <h4><FaTriangleExclamation /> Areas for Improvement</h4>
                                <p>{session?.evaluation?.suggestions || "Refine the structure of your cross-examination and improve argument clarity."}</p>
                            </FeedbackBox>
                        </FeedbackGrid>

                        <FeedbackBox $type="strength" style={{ width: '100%', marginBottom: '2rem' }}>
                            <h4><FaCircleInfo /> Argument Clarity & Logic</h4>
                            <p>{session?.evaluation?.clarity || "Your logical progression was commendable, though some complex points could be simplified for better impact."}</p>
                        </FeedbackBox>

                        <div style={{ textAlign: 'center' }}>
                            <StartButton onClick={() => window.location.reload()}>Start New Simulation</StartButton>
                        </div>
                    </EvalCard>
                </div>
            </EvaluationView>
        );
    }

    if (step === 'history') {
        return (
            <EvaluationView>
                <div style={{ maxWidth: '1000px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h1 style={{ marginBottom: '0.5rem' }}>Trial History</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>Review your past performances and track your legal growth.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ActionButton onClick={runPerformanceAnalysis} disabled={loadingAnalysis || history.length === 0} $type="submit">
                                <FaChartLine /> {loadingAnalysis ? 'Analyzing...' : 'Analyze My Performance'}
                            </ActionButton>
                            <ActionButton onClick={() => setStep('setup')}>
                                <FaGavel /> New Simulation
                            </ActionButton>
                        </div>
                    </div>

                    {performanceAnalysis && (
                        <Card style={{ maxWidth: '100%', textAlign: 'left', marginBottom: '3rem', background: 'rgba(108, 93, 211, 0.05)', borderColor: 'var(--primary)' }}>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FaChartLine /> AI Performance Analysis
                            </h3>
                            <div style={{ whiteSpace: 'pre-line', fontSize: '0.95rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                                {performanceAnalysis}
                            </div>
                            <ActionButton style={{ marginTop: '2rem' }} onClick={() => setPerformanceAnalysis(null)}>
                                Close Analysis
                            </ActionButton>
                        </Card>
                    )}

                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <FaClockRotateLeft size={48} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                            <h3>No trials completed yet</h3>
                            <p style={{ opacity: 0.5, marginBottom: '2rem' }}>Complete your first simulation to see your history here.</p>
                            <StartButton onClick={() => setStep('setup')}>Start First Trial</StartButton>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {history.map((trial) => (
                                <div key={trial._id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '20px',
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                                    alignItems: 'center',
                                    gap: '1.5rem'
                                }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{trial.caseDetails.title}</h4>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase' }}>
                                            {new Date(trial.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>ROLE</span>
                                        <span style={{ fontWeight: 600 }}>{trial.role}</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>LEVEL</span>
                                        <span style={{ fontWeight: 600 }}>{trial.difficulty}</span>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>SCORE</span>
                                        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{trial.evaluation.score}</span>
                                    </div>
                                    <button
                                        onClick={() => fetchSessionDetails(trial._id)}
                                        style={{
                                            background: 'rgba(108, 93, 211, 0.1)',
                                            color: 'var(--primary)',
                                            border: 'none',
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        View <FaChevronRight size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </EvaluationView>
        );
    }

    if (step === 'history_details' && selectedHistorySession) {
        return (
            <Container>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button onClick={() => setStep('history')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                        <FaArrowLeft /> Back to History
                    </button>
                    <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{selectedHistorySession.caseDetails.title}</h2>
                    <span style={{ marginLeft: 'auto', background: 'rgba(108, 93, 211, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {selectedHistorySession.role} • Score: {selectedHistorySession.evaluation.score}/100
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
                        <PanelHeader><FaRobot /> Courtroom Transcript</PanelHeader>
                        <ChatWindow>
                            {selectedHistorySession.messages.map((m, i) => {
                                const msgDate = m.timestamp ? new Date(m.timestamp) : new Date();
                                const prevMsgDate = i > 0 ? (selectedHistorySession.messages[i - 1].timestamp ? new Date(selectedHistorySession.messages[i - 1].timestamp) : new Date()) : null;
                                const showDateSeparator = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();

                                return (
                                    <React.Fragment key={i}>
                                        {showDateSeparator && (
                                            <DateSeparator>
                                                <span>{formatDateLabel(msgDate)}</span>
                                            </DateSeparator>
                                        )}
                                        <MessageBubble $sender={m.sender === 'User' ? 'User' : 'AI'}>
                                            <span className="sender-name">{m.sender}</span>
                                            {m.content}
                                            <MessageTime $user={m.sender === 'User'}>{formatTime(m.timestamp || Date.now())}</MessageTime>
                                        </MessageBubble>
                                    </React.Fragment>
                                );
                            })}
                        </ChatWindow>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.01)', borderLeft: '1px solid rgba(255, 255, 255, 0.05)', overflowY: 'auto', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Trial Results</h3>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(108, 93, 211, 0.1)', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 900 }}>{selectedHistorySession.evaluation.score}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>FINAL PERFORMANCE SCORE</span>
                        </div>

                        <FeedbackBox $type="strength" style={{ marginBottom: '1.5rem' }}>
                            <h4><FaUserCheck /> IPC Proficiency</h4>
                            <p style={{ fontSize: '0.85rem' }}>{selectedHistorySession.evaluation.ipcUse}</p>
                        </FeedbackBox>

                        <FeedbackBox $type="improvement">
                            <h4><FaTriangleExclamation /> Judge's Feedback</h4>
                            <p style={{ fontSize: '0.85rem' }}>{selectedHistorySession.evaluation.suggestions}</p>
                        </FeedbackBox>

                        <div style={{ marginTop: '2.5rem' }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '1.2rem', opacity: 0.6 }}>CASE EVIDENCE RECAP</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {selectedHistorySession.caseDetails.evidence.map((e, i) => (
                                    <EvidenceItem key={i} style={{ padding: '0.6rem' }}>
                                        <FaFileContract size={12} />
                                        <span style={{ fontSize: '0.75rem' }}>{e}</span>
                                    </EvidenceItem>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            {(step === 'setup' || step === 'case_preview') && (
                <SetupOverlay>
                    {step === 'setup' ? (
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <ActionButton onClick={() => setStep('setup')} style={{ background: step === 'setup' ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}>Active Simulation</ActionButton>
                                <ActionButton onClick={() => setStep('history')} style={{ background: step === 'history' ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}>My Trial History</ActionButton>
                            </div>

                            <FaGavel style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }} />
                            <h1>AI Moot Court Simulator</h1>
                            <p>Step into the courtroom and test your legal skills against dynamic AI opponents in a realistic trial simulation.</p>

                            <OptionGrid>
                                <SelectButton $active={role === 'Prosecutor'} onClick={() => setRole('Prosecutor')}>
                                    <FaUserTie />
                                    <span>Prosecutor</span>
                                    <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>Assert the charges</small>
                                </SelectButton>
                                <SelectButton $active={role === 'Defense Lawyer'} onClick={() => setRole('Defense Lawyer')}>
                                    <FaUserGraduate />
                                    <span>Defense Lawyer</span>
                                    <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>Protect the accused</small>
                                </SelectButton>
                            </OptionGrid>

                            <h3 style={{ marginBottom: '1rem' }}>Simulation Difficulty</h3>
                            <LevelGrid>
                                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                    <LevelTag key={lvl} $active={difficulty === lvl} onClick={() => setDifficulty(lvl)}>
                                        {lvl}
                                    </LevelTag>
                                ))}
                            </LevelGrid>

                            {error && (
                                <div style={{ color: '#ff7675', background: 'rgba(255, 118, 117, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(255, 118, 117, 0.2)' }}>
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            <StartButton onClick={handleStart} disabled={typing}>
                                {typing ? 'Configuring Courtroom...' : 'Begin Preparation'}
                            </StartButton>
                        </Card>
                    ) : (
                        <Card style={{ textAlign: 'left', maxWidth: '800px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: 'var(--primary)', margin: 0 }}>{session?.caseDetails?.title}</h2>
                                <span style={{ padding: '0.4rem 0.8rem', background: 'rgba(108, 93, 211, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>PREVIEW</span>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaFileContract size={14} /> Case Background
                            </h3>
                            <p style={{ marginBottom: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{session?.caseDetails?.background}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#fff' }}>Evidence List</h3>
                                    <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {session?.caseDetails?.evidence?.map((e, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.6rem' }}>
                                                <FaShieldHalved size={12} style={{ marginTop: '0.2rem', color: 'var(--primary)' }} /> {e}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#fff' }}>Applicable IPC Laws</h3>
                                    <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {session?.caseDetails?.relevantSections?.map((s, i) => (
                                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.6rem' }}>
                                                <FaBuildingColumns size={12} style={{ marginTop: '0.2rem', color: 'var(--primary)' }} /> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <StartButton onClick={() => setStep('simulation')}>Enter Courtroom & Start Trial</StartButton>
                            </div>
                        </Card>
                    )}
                </SetupOverlay>
            )}

            {step === 'simulation' && session && (
                <>
                    <TopHeader>
                        <HeaderItem>
                            <span className="label"><FaGavel size={12} /> Case Title</span>
                            <span className="value" title={session.caseDetails.title}>{session.caseDetails.title}</span>
                        </HeaderItem>
                        <HeaderItem>
                            <span className="label"><FaBuildingColumns size={12} /> Court Name</span>
                            <span className="value">District Sessions Court</span>
                        </HeaderItem>
                        <HeaderItem>
                            <span className="label"><FaShieldHalved size={12} /> User Role</span>
                            <span className="value">{role}</span>
                        </HeaderItem>
                        <HeaderItem>
                            <span className="label"><FaTriangleExclamation size={12} /> Level</span>
                            <span className="value">{difficulty}</span>
                        </HeaderItem>
                        <HeaderItem>
                            <span className="label"><FaScaleBalanced size={12} /> Status</span>
                            <span className="value" style={{ color: '#19c37d' }}>Live Simulation</span>
                        </HeaderItem>
                    </TopHeader>

                    <CourtroomBody>
                        {/* Left Panel: Judge */}
                        <SidePanel $left>
                            <PanelHeader><FaGavel /> Honorable Judge</PanelHeader>
                            <PanelScroll>
                                {judgeMessages.length > 0 ? (
                                    judgeMessages.map((m, i) => (
                                        <JudgeCard key={i}>{m.content}</JudgeCard>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.85rem', marginTop: '2rem' }}>
                                        Waiting for the Judge's opening remarks...
                                    </p>
                                )}
                                {typing && <div style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>The Judge is presiding...</div>}
                            </PanelScroll>
                        </SidePanel>

                        {/* Center Panel: Debate */}
                        <DebateCenter>
                            <PanelHeader><FaRobot /> Courtroom Debate</PanelHeader>
                            <ChatWindow>
                                {debateMessages.map((m, i) => {
                                    const msgDate = m.timestamp ? new Date(m.timestamp) : new Date();
                                    const prevMsgDate = i > 0 ? (debateMessages[i - 1].timestamp ? new Date(debateMessages[i - 1].timestamp) : new Date()) : null;
                                    const showDateSeparator = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();

                                    return (
                                        <React.Fragment key={i}>
                                            {showDateSeparator && (
                                                <DateSeparator>
                                                    <span>{formatDateLabel(msgDate)}</span>
                                                </DateSeparator>
                                            )}
                                            <MessageBubble $sender={m.sender}>
                                                <span className="sender-name">{m.sender}</span>
                                                {m.content}
                                                <MessageTime $user={m.sender === 'User'}>{formatTime(m.timestamp || Date.now())}</MessageTime>
                                            </MessageBubble>
                                        </React.Fragment>
                                    );
                                })}
                                {typing && (
                                    <p style={{ fontStyle: 'italic', opacity: 0.4, fontSize: '0.85rem', paddingLeft: '1rem' }}>
                                        AI Counsel is preparing a counter-argument...
                                    </p>
                                )}
                                <div ref={chatEndRef} />
                            </ChatWindow>
                        </DebateCenter>

                        {/* Right Panel: Evidence */}
                        <SidePanel>
                            <PanelHeader><FaFileContract /> Case Evidence</PanelHeader>
                            <PanelScroll>
                                <h4 style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.5rem' }}>EXHIBITS</h4>
                                {session.caseDetails.evidence.map((e, i) => (
                                    <EvidenceItem key={i}>
                                        <FaFileContract size={14} />
                                        <span>{e}</span>
                                    </EvidenceItem>
                                ))}

                                <h4 style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '1rem', marginBottom: '0.5rem' }}>WITNESS LIST</h4>
                                {session.caseDetails.witnesses.map((w, i) => (
                                    <EvidenceItem key={i}>
                                        <FaUserCheck size={14} />
                                        <span>{w}</span>
                                    </EvidenceItem>
                                ))}
                            </PanelScroll>
                        </SidePanel>
                    </CourtroomBody>

                    <ControlBar>
                        <InputRow>
                            <TextArea
                                placeholder="Clearly state your legal argument, cite IPC sections, or cross-examine witnesses..."
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                        </InputRow>
                        <ActionButtons>
                            <ButtonGroup>
                                <ActionButton $type="objection" onClick={() => handleSendMessage(true)} disabled={typing}>
                                    <FaTriangleExclamation /> Raise Objection
                                </ActionButton>
                                <ActionButton onClick={handleEndSession} disabled={typing}>
                                    <FaXmark /> Conclude Trial
                                </ActionButton>
                            </ButtonGroup>

                            <ActionButton $type="submit" onClick={() => handleSendMessage()} disabled={typing || !userMessage.trim()}>
                                Submit Argument <FaPaperPlane size={14} />
                            </ActionButton>
                        </ActionButtons>
                    </ControlBar>
                </>
            )}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        background: '#161923',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        maxWidth: '450px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(245, 101, 101, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#f56565'
                        }}>
                            <FaGavel size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Conclude Trial?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                            Are you sure you want to end this simulation? You will receive your final performance evaluation from the Judge.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmConclude}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes, Conclude
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default MootCourtSimulator;
