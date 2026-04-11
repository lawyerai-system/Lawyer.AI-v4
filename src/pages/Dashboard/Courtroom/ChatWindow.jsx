import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import { useChatContext } from '../../../context/ChatContext';
import { useSocketContext } from '../../../context/SocketContext';
import {
    FaPaperPlane, FaArrowLeft, FaThumbtack, FaRobot,
    FaChevronDown, FaChevronUp, FaScaleBalanced,
    FaGavel, FaLightbulb, FaRotateRight, FaXmark,
    FaTrash, FaPen
} from 'react-icons/fa6';
import ConfirmModal from '../../../components/Common/ConfirmModal';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0,0,0,0.1);
  min-height: 100%;
  position: relative;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(15, 15, 20, 0.8);
  backdrop-filter: blur(10px);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: none;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover { background: rgba(255,255,255,0.1); }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SummaryPanel = styled.div`
  margin: 1rem 1.5rem 0.5rem;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.15) 0%, rgba(102, 126, 234, 0.1) 100%);
  border: 1px solid rgba(118, 75, 162, 0.3);
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease;
`;

const SummaryHeader = styled.div`
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  
  h4 { 
    margin: 0; 
    font-size: 0.9rem; 
    display: flex; 
    align-items: center; 
    gap: 0.6rem; 
    color: #b794f4;
  }
`;

const SummaryContent = styled.div`
  padding: 0 1.2rem 1.2rem;
  font-size: 0.9rem;
  line-height: 1.6;
  border-top: 1px solid rgba(255,255,255,0.05);
  
  .issue { font-weight: 700; color: white; margin-bottom: 0.5rem; display: block; }
  .text { color: var(--text-secondary); margin-bottom: 1rem; display: block; }
  
  .sections {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const SectionBadge = styled.span`
  background: rgba(25, 195, 125, 0.1);
  color: #19c37d;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(25, 195, 125, 0.2);
`;

const PinnedContainer = styled.div`
  padding: 0.5rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PinnedHeader = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PinnedItem = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #f6ad55;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;

  .text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  button { 
    background: none; 
    border: none; 
    color: #f6ad55; 
    cursor: pointer; 
    margin-left: 10px;
    opacity: 0.7;
    &:hover { opacity: 1; }
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 1rem 1.2rem;
  border-radius: 20px;
  background: ${props => props.isOwn ? 'linear-gradient(135deg, var(--primary) 0%, #4a3471 100%)' : 'rgba(30, 30, 40, 0.8)'};
  color: white;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    .pin-action { opacity: 1; }
  }

  ${props => !props.isOwn && css`
    border-bottom-left-radius: 4px;
  `}
  
  ${props => props.isOwn && css`
    border-bottom-right-radius: 4px;
  `}

  .sender-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    color: ${props => props.isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'};
    font-weight: 600;
  }
`;

const RoleTag = styled.span`
  font-size: 0.6rem;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  background: ${props => props.role === 'lawyer' ? 'rgba(183, 148, 244, 0.2)' : 'rgba(99, 179, 237, 0.2)'};
  color: ${props => props.role === 'lawyer' ? '#b794f4' : '#63b3ed'};
  border: 1px solid ${props => props.role === 'lawyer' ? 'rgba(183, 148, 244, 0.3)' : 'rgba(99, 179, 237, 0.3)'};
`;

const PinAction = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${props => props.pinned ? 'var(--primary)' : '#333'};
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover { transform: scale(1.1); background: var(--primary); }
`;

const MessageActions = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  display: flex;
  gap: 0.3rem;
  opacity: 0;
  transition: all 0.2s;
  z-index: 10;

  ${MessageBubble}:hover & {
    opacity: 1;
  }
`;

const ActionIcon = styled.button`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #333;
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  
  &:hover { 
    background: ${props => props.type === 'delete' ? '#e74c3c' : 'var(--primary)'};
    transform: scale(1.1);
  }
`;

const SuggestionBox = styled.div`
  position: absolute;
  bottom: 85px;
  right: 25px;
  width: 320px;
  background: rgba(20, 20, 25, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(118, 75, 162, 0.4);
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.3s ease;
  z-index: 100;
  
  h5 { 
    margin: 0 0 1rem; 
    display: flex; 
    align-items: center; 
    gap: 0.6rem; 
    color: #63b3ed;
    font-size: 0.9rem;
  }
`;

const PrivacyNotice = styled.div`
  background: rgba(108, 93, 211, 0.08);
  border: 1px solid rgba(108, 93, 211, 0.2);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  margin: 1rem auto 2rem;
  max-width: 500px;
  text-align: center;
  font-size: 0.8rem;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  line-height: 1.4;

  .lock-icon {
    color: var(--primary);
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 50%, transparent);
  }

  span {
    background: rgba(40, 40, 50, 0.8);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.75rem;
    color: #a0aec0;
    font-weight: 600;
    z-index: 1;
    border: 1px solid rgba(255,255,255,0.05);
    backdrop-filter: blur(4px);
  }
`;

const MessageTime = styled.span`
  font-size: 0.65rem;
  color: ${props => props.isOwn ? 'rgba(255,255,255,0.5)' : '#a0aec0'};
  margin-top: 0.4rem;
  display: block;
  text-align: right;
  font-weight: 500;
`;

const SuggestionItem = styled.div`
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  &:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  
  .section { font-weight: 700; color: #19c37d; font-size: 0.85rem; margin-bottom: 0.2rem; display: block; }
  .reason { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; }
`;

const InputArea = styled.form`
  padding: 1rem 1.5rem;
  background: #101015;
  display: flex;
  gap: 1rem;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.05);
  position: relative;

  input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 1rem 1.5rem;
    color: white;
    font-size: 0.95rem;
    
    &:focus { outline: none; border-color: var(--primary); background: rgba(255,255,255,0.08); }
  }
`;

const SendBtn = styled.button`
  background: linear-gradient(135deg, var(--primary) 0%, #4a3471 100%);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4); }
  &:active { transform: translateY(0); }
`;

const SummaryActionBtn = styled.button`
  background: rgba(118, 75, 162, 0.2);
  border: 1px solid rgba(118, 75, 162, 0.4);
  color: #b794f4;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover { background: rgba(118, 75, 162, 0.3); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DetailModal = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: var(--bg-secondary);
  width: 90%; max-width: 450px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2.5rem;
  position: relative;
  
  h2 { margin: 0 0 1.5rem; color: var(--primary); font-size: 1.8rem; }
  
  .row {
    margin: 1.2rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    
    label { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
    span { font-size: 1.1rem; font-weight: 500; color: white; }
  }

  button.close {
    position: absolute; top: 1.2rem; right: 1.2rem;
    background: rgba(255,255,255,0.05);
    border: none; color: white; width: 32px; height: 32px;
    border-radius: 50%; cursor: pointer;
    &:hover { background: var(--danger); }
  }
`;

const ChatWindow = () => {
    const { user } = useAuth();
    const { chatId, setChatId, chatInfo, updateMessageStatusToRead, fetchContacts } = useChatContext();
    const { socket, socketValue: { messageData } } = useSocketContext();

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [msgToDelete, setMsgToDelete] = useState(null);

    // Feature States
    const [summary, setSummary] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const messagesAreaRef = useRef(null);
    const suggestionTimeoutRef = useRef(null);

    const formatDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Initial Fetch
    useEffect(() => {
        if (chatId) {
            const loadChatData = async () => {
                try {
                    // Fetch Messages
                    const res = await api.get(`/api/courtroom/${user.id}/messages?type=${chatInfo.chatType}&chatId=${chatId}`);
                    setMessages(res.data.data);

                    // Update read status
                    updateMessageStatusToRead(chatId, chatInfo.chatType);
                    fetchContacts();

                    // Initial Summary Fetch
                    const sumRes = await api.get(`/api/courtroom/${user.id}/chat/summary?type=${chatInfo.chatType}&chatId=${chatId}`);
                    if (sumRes.data.data) setSummary(sumRes.data.data);
                } catch (err) {
                    console.error("Load Chat Error:", err);
                }
            };
            loadChatData();
        }
    }, [chatId, user.id, chatInfo.chatType]);

    // Role Indicator Mapping
    const getRoleLabel = (role) => {
        if (role === 'user') return 'Civilian';
        if (role === 'law_student') return 'Law Student';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    // Socket Listener
    useEffect(() => {
        if (socket) {
            socket.on('PIN_UPDATED', ({ messageId, isPinned }) => {
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isPinned } : m));
            });

            socket.on('RECEIVE_SUMMARY', (newSummary) => {
                setSummary(newSummary);
                setShowSummary(true);
            });

            return () => {
                socket.off('PIN_UPDATED');
                socket.off('RECEIVE_SUMMARY');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (messageData && chatId) {
            const { sender, receiver, type } = messageData;
            const isCurrentChat =
                (type === 'user' && (sender === chatId || receiver === chatId)) ||
                (type === 'room' && receiver === chatId);

            if (isCurrentChat) {
                setMessages(prev => [...prev, messageData]);
                if (sender !== user.id) {
                    updateMessageStatusToRead(chatId, chatInfo.chatType);
                }
            }
        }
    }, [messageData, chatId]);

    // Auto-scroll
    useEffect(() => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    }, [messages]);

    // Real-time suggestions debounced
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputText(val);

        if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);

        if (val.length > 10) {
            suggestionTimeoutRef.current = setTimeout(async () => {
                try {
                    const res = await api.post(`/api/courtroom/${user.id}/chat/suggestions`, { message: val });
                    setSuggestions(res.data.data || []);
                } catch (err) {
                    setSuggestions([]);
                }
            }, 1200);
        } else {
            setSuggestions([]);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const sentText = inputText;
        setInputText('');
        setSuggestions([]);

        try {
            const res = await api.post(`/api/courtroom/${user.id}/message?chatId=${chatId}`, {
                message: sentText
            });

            const newMsg = {
                ...res.data.data,
                type: chatInfo.chatType,
                sender: user.id,
                receiver: chatId,
                role: user.role,
                createdAt: new Date().toISOString()
            };

            setMessages(prev => [...prev, newMsg]);

            // Emit socket event
            socket.emit('SEND_MESSAGE', newMsg);
        } catch (err) {
            console.error(err);
        }
    };

    const togglePin = async (msgId) => {
        try {
            await api.put(`/api/courtroom/${user.id}/messages/pin/${msgId}`);
            setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isPinned: !m.isPinned } : m));
        } catch (err) {
            console.error("Pin Error:", err);
        }
    };

    const handleDelete = (msgId) => {
        setMsgToDelete(msgId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!msgToDelete) return;
        try {
            await api.delete(`/api/courtroom/${user.id}/messages/${msgToDelete}`);
            setMessages(prev => prev.filter(m => m._id !== msgToDelete));
            setMsgToDelete(null);
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const handleEditStart = (msg) => {
        setEditingId(msg._id);
        setEditValue(msg.message);
    };

    const handleEditSave = async (msgId) => {
        if (!editValue.trim()) return;
        try {
            await api.patch(`/api/courtroom/${user.id}/messages/${msgId}`, { message: editValue });
            setMessages(prev => prev.map(m => m._id === msgId ? { ...m, message: editValue } : m));
            setEditingId(null);
        } catch (err) {
            console.error("Edit Error:", err);
        }
    };

    const generateSummary = async () => {
        if (messages.length < 3) {
            setError("Discuss more before generating a summary!");
            return;
        }
        setIsSummarizing(true);
        try {
            const res = await api.post(`/api/courtroom/${user.id}/chat/summary`, {
                type: chatInfo.chatType,
                chatId
            });
            const newSummary = res.data.data;
            setSummary(newSummary);
            setShowSummary(true);

            // Emit socket event
            socket.emit('SUMMARY_UPDATED', {
                chatId,
                type: chatInfo.chatType,
                summary: newSummary,
                senderId: user.id
            });
        } catch (err) {
            console.error("Summary Gen Error:", err);
        } finally {
            setIsSummarizing(false);
        }
    };

    const pinnedMessages = messages.filter(m => m.isPinned);

    if (!chatId) return (
        <Wrapper style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.5 }}>
                <FaScaleBalanced />
            </div>
            <h2 style={{ color: 'var(--text-main)', fontSize: '2rem', marginBottom: '1rem' }}>Your Secure Courtroom</h2>
            <p style={{ maxWidth: '450px', lineHeight: '1.8', opacity: 0.8 }}>
                Select a verified lawyer or civilian from the list to begin discussing legal matters with AI-enhanced auditing and summaries.
            </p>
        </Wrapper>
    );

    return (
        <Wrapper>
            {error && (
                <div style={{ background: 'rgba(255, 118, 117, 0.1)', color: '#ff7675', padding: '0.8rem 1.5rem', fontSize: '0.9rem', borderBottom: '1px solid rgba(255, 118, 117, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>Error:</strong> {error}</span>
                    <FaXmark style={{ cursor: 'pointer' }} onClick={() => setError(null)} />
                </div>
            )}
            <ChatHeader>
                <BackBtn onClick={() => setChatId(null)}><FaArrowLeft /></BackBtn>
                <div onClick={() => setShowModal(true)} style={{ cursor: 'pointer', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {chatInfo.name}
                        <RoleTag role={chatInfo.role}>{getRoleLabel(chatInfo.role)}</RoleTag>
                    </div>
                </div>
                <SummaryActionBtn onClick={generateSummary} disabled={isSummarizing}>
                    {isSummarizing ? <FaRotateRight className="fa-spin" /> : <FaRobot />}
                    {summary ? 'Refresh Summary' : 'AI Analysis'}
                </SummaryActionBtn>
            </ChatHeader>

            {summary && (
                <SummaryPanel>
                    <SummaryHeader onClick={() => setShowSummary(!showSummary)}>
                        <h4><FaGavel /> Case Overview: {summary.legalIssue}</h4>
                        {showSummary ? <FaChevronUp /> : <FaChevronDown />}
                    </SummaryHeader>
                    {showSummary && (
                        <SummaryContent>
                            <span className="text">{summary.summary}</span>
                            <strong style={{ fontSize: '0.8rem', color: 'white', display: 'block', marginBottom: '0.5rem' }}>Key Points:</strong>
                            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1rem', color: 'var(--text-secondary)' }}>
                                {summary.keyArguments.map((arg, idx) => <li key={idx}>{arg}</li>)}
                            </ul>
                            {summary.ipcSections?.length > 0 && (
                                <div className="sections">
                                    {summary.ipcSections.map(sec => <SectionBadge key={sec}>{sec}</SectionBadge>)}
                                </div>
                            )}
                        </SummaryContent>
                    )}
                </SummaryPanel>
            )}

            {pinnedMessages.length > 0 && (
                <PinnedContainer>
                    <PinnedHeader><FaThumbtack size={12} /> Pinned Messages</PinnedHeader>
                    {pinnedMessages.slice(-2).map(msg => (
                        <PinnedItem key={msg._id}>
                            <span className="text">{msg.message}</span>
                            <button onClick={() => togglePin(msg._id)}>Unpin</button>
                        </PinnedItem>
                    ))}
                    {pinnedMessages.length > 2 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            + {pinnedMessages.length - 2} more pinned
                        </span>
                    )}
                </PinnedContainer>
            )}

            <MessagesArea ref={messagesAreaRef}>
                <PrivacyNotice>
                    <FaScaleBalanced className="lock-icon" />
                    <span>
                        Messages in this virtual courtroom are <strong>Temporary & Encrypted</strong>.
                        They will disappear once the case is resolved or after <strong>15 days</strong> of inactivity to ensure legal compliance.
                    </span>
                </PrivacyNotice>

                {messages.map((msg, i) => {
                    const isOwn = msg.sender === user.id;
                    const displayRole = isOwn ? user.role : (msg.role || chatInfo.role);

                    const msgDate = new Date(msg.createdAt).toDateString();
                    const prevMsgDate = i > 0 ? new Date(messages[i - 1].createdAt).toDateString() : null;
                    const showDateLabel = msgDate !== prevMsgDate;

                    return (
                        <React.Fragment key={msg._id || i}>
                            {showDateLabel && (
                                <DateSeparator>
                                    <span>{formatDateLabel(msg.createdAt)}</span>
                                </DateSeparator>
                            )}
                            <MessageBubble isOwn={isOwn}>
                                <div className="sender-info">
                                    {isOwn ? 'You' : (chatInfo.name.split(' ')[0])}
                                    <RoleTag role={displayRole}>{getRoleLabel(displayRole)}</RoleTag>
                                </div>

                                {editingId === msg._id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <textarea
                                            style={{ background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem', resize: 'none' }}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }} onClick={() => handleEditSave(msg._id)}>Save</button>
                                            <button style={{ background: '#444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.7rem', cursor: 'pointer' }} onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {msg.message}
                                        {isOwn && (
                                            <MessageActions>
                                                <ActionIcon onClick={() => handleEditStart(msg)} title="Edit Message"><FaPen /></ActionIcon>
                                                <ActionIcon type="delete" onClick={() => handleDelete(msg._id)} title="Delete Message"><FaTrash /></ActionIcon>
                                            </MessageActions>
                                        )}
                                    </>
                                )}

                                <MessageTime isOwn={isOwn}>
                                    {formatTime(msg.createdAt)}
                                </MessageTime>
                                <PinAction
                                    className="pin-action"
                                    pinned={msg.isPinned}
                                    onClick={() => togglePin(msg._id)}
                                    title={msg.isPinned ? "Unpin message" : "Pin message"}
                                >
                                    <FaThumbtack />
                                </PinAction>
                            </MessageBubble>
                        </React.Fragment>
                    );
                })}
            </MessagesArea>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Message?"
                message="This message will be permanently removed for everyone in this courtroom. Are you sure you want to continue?"
                confirmText="Delete Message"
                type="danger"
                icon={<FaTrash style={{ color: '#ef4444' }} />}
            />

            {suggestions.length > 0 && (
                <SuggestionBox>
                    <h5><FaLightbulb /> AI Legal Insights</h5>
                    {suggestions.map((item, idx) => (
                        <SuggestionItem key={idx}>
                            <span className="section">{item.section}</span>
                            <span className="reason">{item.reason}</span>
                        </SuggestionItem>
                    ))}
                </SuggestionBox>
            )}

            <InputArea onSubmit={handleSend}>
                <input
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type legal details or questions..."
                />
                <SendBtn type="submit"><FaPaperPlane /></SendBtn>
            </InputArea>

            {showModal && (
                <DetailModal onClick={() => setShowModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <button className="close" onClick={() => setShowModal(false)}>&times;</button>
                        <h2>{chatInfo.name}</h2>
                        <div className="row">
                            <label>Designation</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <RoleTag role={chatInfo.role} style={{ fontSize: '0.9rem' }}>{getRoleLabel(chatInfo.role)}</RoleTag>
                            </div>
                        </div>
                        {chatInfo.email && (
                            <div className="row"><label>Email Address</label><span>{chatInfo.email}</span></div>
                        )}
                        {chatInfo.phone && (
                            <div className="row"><label>Contact Line</label><span>{chatInfo.phone}</span></div>
                        )}
                    </ModalContent>
                </DetailModal>
            )}
        </Wrapper>
    );
};

export default ChatWindow;
