import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import UserAvatar from '../../components/Common/UserAvatar';
import api from '../../utils/axios';
import { FaPaperPlane, FaTrash, FaRobot, FaUser, FaBars, FaXmark, FaPlus, FaLightbulb, FaGavel, FaFileContract, FaScaleUnbalanced } from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/Common/ConfirmModal';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
`;

// --- ChatGPT Style Components ---

const ChatPageLayout = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  color: #ececf1;
  position: relative;
`;

const Sidebar = styled.div`
  width: ${props => props.$isOpen ? '260px' : '0'};
  background: #202123;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow-x: hidden;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.1);
  position: sticky;
  top: 75px;
  height: calc(100vh - 75px);
  overflow-y: hidden; /* Main sidebar doesn't scroll, inner list does */
  
  @media (max-width: 768px) {
    position: fixed;
    top: 75px;
    height: calc(100vh - 75px);
    z-index: 2100;
    box-shadow: ${props => props.$isOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'};
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    background: #343541;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    position: sticky;
    top: 75px; /* Push below global navbar */
    z-index: 1500;
    font-weight: 600;
  }
`;

const MainChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding-bottom: 120px;
  scroll-behavior: smooth;
`;

/* Message Row - Striped like ChatGPT */
const MessageRow = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  background: ${props => props.$isBot ? '#444654' : 'transparent'};
  padding: 1.5rem;
  
  display: flex;
  justify-content: center;
`;

const MessageContent = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0 0.5rem;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 2px; /* ChatGPT square-ish avatars */
  background: ${props => props.$isBot ? '#10a37f' : '#573cff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 0.9rem;
`;

const TextBlock = styled.div`
  flex: 1;
  font-size: 1rem;
  line-height: 1.6;
  color: #ececf1;
  overflow-wrap: break-word;
  position: relative;

  /* Markdown Styles */
  p { margin-bottom: 1rem; &:last-child { margin-bottom: 0; } }
  code { 
    font-family: 'Söhne Mono', Monaco, Andale Mono, Ubuntu Mono, monospace; 
    background: black; 
    padding: 2px 4px; 
    border-radius: 3px; 
  }
  pre {
    background: black;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;
  }
  ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }
  li { margin-bottom: 0.5rem; }
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
    background: rgba(255,255,255,0.05);
  }
  
  span {
    background: #202123;
    padding: 2px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #8e8ea0;
    font-weight: 600;
    z-index: 1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid rgba(255,255,255,0.05);
  }
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  color: ${props => props.$user ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)'};
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  font-weight: 500;
`;

const SectionBadge = styled.a`
  display: inline-block;
  background: rgba(87, 60, 255, 0.15);
  color: #a78bfa;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9em;
  margin: 0 4px;
  border: 1px solid rgba(87, 60, 255, 0.3);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(87, 60, 255, 0.3);
    color: #c4b5fd;
    text-decoration: none;
  }
`;

const SectionModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
`;

const SectionModalContent = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  color: var(--text-main);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  h3 { margin-top: 0; color: #a78bfa; font-size: 1.4rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; }
  h4 { color: #f3f4f6; margin: 1rem 0 0.5rem 0; font-size: 1.1rem; }
  p { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  &:hover { color: white; }
`;

const InputArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(53,53,65,0), #343541 50%);
  padding: 2rem 1rem 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem 1rem;
    background: #343541;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 768px;
  background: #40414f;
  border: 1px solid rgba(32,33,35,0.5);
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  padding: 0.75rem 1rem;
  gap: 0.5rem;
  
  &:focus-within {
    border-color: rgba(255,255,255,0.2);
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  max-height: 200px;
  line-height: 1.5;
  padding: 0;
  margin-bottom: 2px; // Align with button

  &:focus { outline: none; }
  &::placeholder { color: #8e8ea0; }
`;

const SendButton = styled.button`
  background: ${props => props.disabled ? 'transparent' : '#19c37d'};
  color: ${props => props.disabled ? '#8e8ea0' : 'white'};
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: #1a7f5a;
  }
`;

const Disclaimer = styled.div`
  margin-top: 10px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  text-align: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ToggleBtn = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover { background: rgba(255,255,255,0.2); }

  @media (max-width: 768px) {
    display: none; /* Hide on mobile since we have MobileHeader */
  }
`;

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  color: #ececf1;
  padding: 1rem;
  
  h1 { font-size: 2rem; margin-bottom: 2rem; font-weight: 600; }

  @media (max-width: 768px) {
    justify-content: flex-start; /* Allow scrolling from top */
    padding-top: 2rem;
    height: auto; /* Let it grow */
  }
`;

// Reuse History components but style slightly darker
const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #565869; }
`;

// Re-defining other components to avoid errors
const SidebarHeader = styled.div`
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: #202123;
  flex-shrink: 0;

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      font-size: 0.75rem;
      font-weight: 800;
      color: #8e8ea0;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
  }

  .action-btns {
      display: flex;
      gap: 0.6rem;
      align-items: center;
  }
`;

const CloseSidebarBtn = styled.button`
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
    background: rgba(255, 255, 255, 0.1);
    color: #ef4444;
  }
`;
const NewChatBtn = styled.button`
  flex: 1;
  padding: 0.6rem 0.8rem;
  background: rgba(108, 93, 211, 0.1);
  border: 1px solid rgba(108, 93, 211, 0.2);
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: var(--primary);
    border-color: var(--primary);
  }

  @media (max-width: 480px) {
      span { display: none; }
      padding: 0.6rem;
  }
`;
const HistoryItem = styled.div`
  margin: 0.2rem 0.5rem;
  padding: 0.7rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$active ? 'white' : '#ececf1'};
  background: ${props => props.$active ? 'rgba(52, 53, 65, 1)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.05);
    .delete-btn { opacity: 1; }
  }

  .item-main {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex: 1;
      overflow: hidden;
      
      span {
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
  }
`;
const DeleteBtn = styled.button` 
  background: none; 
  border: none; 
  color: #565869; 
  opacity: 0; 
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover { 
      color: #ef4444; 
      background: rgba(239, 68, 68, 0.1);
  }

  @media (max-width: 768px) {
      opacity: 1;
  }
`;
const SuggestionCard = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  margin: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover { background: rgba(255,255,255,0.1); }
  h4 { margin: 0 0 0.5rem 0; font-weight: 600; }
  span { opacity: 0.8; }
`;
const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const TypingDot = styled.div` width: 8px; height: 8px; background: #ccc; border-radius: 50%; opacity: 0.6; `;
// ...

const ChatPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Initialize sidebar based on window width
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [deleteId, setDeleteId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null); // For modal message
  const [selectedSection, setSelectedSection] = useState(null); // Data for modal
  const [loadingSection, setLoadingSection] = useState(false);

  const suggestions = [
    { title: "Explain a Law", text: "Explain the simple meaning of IPC Section 302." },
    { title: "Legal Procedure", text: "What is the process of getting bail in India?" },
    { title: "Document Review", text: "What are the essential elements of a Rent Agreement?" },
    { title: "Consumer Rights", text: "How can I file a complaint in Consumer Court?" }
  ];

  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => { resizeInput(); }, [input]);

  useEffect(() => {
    // Only scroll to bottom if there are actual messages or we are loading a response
    // This prevents the page from jumping to the footer on initial empty load
    if (messages.length > 0 || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/chat/sessions');
        if (res.data && Array.isArray(res.data.data)) {
          setSessions(res.data.data);
        } else {
          setSessions([]);
        }
      } catch (err) {
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  const loadSession = async (id) => {
    try {
      setLoading(true);
      setCurrentSessionId(id);
      const res = await api.get(`/api/chat/session/${id}`);
      if (res.data && res.data.data && Array.isArray(res.data.data.messages)) {
        setMessages(res.data.data.messages);
      } else {
        setMessages([]);
      }
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
    if (inputRef.current) inputRef.current.focus();
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSectionClick = async (href) => {
    try {
      const parts = href.replace('#section-', '').split('-');
      if (parts.length < 2) return;
      const source = parts[0];
      const section = parts.slice(1).join('-'); // re-join in case section has hyphens like 302-A

      setLoadingSection(true);
      setSelectedSection({ loading: true });
      const res = await api.get(`/api/chat/section?source=${source}&section=${section}`);
      if (res.data && res.data.status === 'success') {
        setSelectedSection(res.data.data);
      } else {
        setSelectedSection({ title: 'Section Details Not Found', description: 'Could not fetch details from the legal database.' });
      }
    } catch (e) {
      console.error('Failed to load section:', e);
      setSelectedSection({ title: 'Error Loading Section', description: 'Failed to communicate with the server.' });
    } finally {
      setLoadingSection(false);
    }
  };

  const handleSend = async (val = input) => {
    if (!val.trim()) return;
    const userMsg = val;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await api.post('/api/chat/send', {
        message: userMsg,
        sessionId: currentSessionId
      });

      const responseData = res.data.data;

      if (responseData && responseData.sessionId && !currentSessionId) {
        setCurrentSessionId(responseData.sessionId);
        setSessions(prev => [{ _id: responseData.sessionId, title: userMsg.substring(0, 30) + '...' }, ...prev]);
      }

      const botContent = (responseData && responseData.response) ? responseData.response : "Received empty response.";
      setMessages(prev => [...prev, { role: 'bot', content: botContent, timestamp: new Date().toISOString() }]);

    } catch (err) {
      console.error("Chat Send Error:", err);
      const errorMsg = err.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteClick = (e, session) => {
    e.stopPropagation();
    setDeleteId(session._id);
    setItemToDelete(session.title);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/chat/session/${deleteId}`);
      setSessions(prev => prev.filter(s => s._id !== deleteId));
      if (currentSessionId === deleteId) handleNewChat();
    } catch (err) { console.error(err); }
    setDeleteId(null);
    setItemToDelete(null);
  };

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

  return (
    <ChatPageLayout>
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this chat history?"
        itemName={itemToDelete}
        type="danger"
      />

      {selectedSection && (
        <SectionModalOverlay onClick={() => setSelectedSection(null)}>
          <SectionModalContent onClick={e => e.stopPropagation()}>
            <ModalCloseBtn onClick={() => setSelectedSection(null)}><FaXmark size={20} /></ModalCloseBtn>
            {loadingSection ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FaScaleUnbalanced size={30} color="#a78bfa" className="fa-spin" style={{ animation: 'spin 2s linear infinite' }} />
                <p style={{ marginTop: '1rem' }}>Loading Section Details...</p>
              </div>
            ) : (
              <>
                <h3>{selectedSection.source ? `${selectedSection.source} Section ${selectedSection.section}` : selectedSection.title || 'Details'}</h3>
                {selectedSection.source && <h4>{selectedSection.title}</h4>}
                <p><strong>Description:</strong> {selectedSection.description}</p>
                {selectedSection.example && (
                  <p style={{ marginTop: '1rem' }}><strong>Example:</strong> {selectedSection.example}</p>
                )}
              </>
            )}
          </SectionModalContent>
        </SectionModalOverlay>
      )}

      <Sidebar $isOpen={isSidebarOpen}>
        <SidebarHeader>
          <div className="header-top">
            <h3>History</h3>
            <CloseSidebarBtn onClick={() => setIsSidebarOpen(false)}>
              <FaXmark size={18} />
            </CloseSidebarBtn>
          </div>

          <div className="action-btns">
            <NewChatBtn onClick={handleNewChat}>
              <FaPlus size={14} />
              <span>New Chat</span>
            </NewChatBtn>
          </div>
        </SidebarHeader>

        <HistoryList>
          {sessions.map(s => (
            <HistoryItem key={s._id} $active={currentSessionId === s._id} onClick={() => loadSession(s._id)}>
              <div className="item-main">
                <FaFileContract size={14} style={{ opacity: currentSessionId === s._id ? 1 : 0.5 }} />
                <span>{s.title}</span>
              </div>
              <DeleteBtn className="delete-btn" onClick={(e) => onDeleteClick(e, s)}>
                <FaTrash size={12} />
              </DeleteBtn>
            </HistoryItem>
          ))}
          {sessions.length === 0 && (
            <div style={{ padding: '2rem 1rem', color: '#8e8ea0', fontSize: '0.8rem', textAlign: 'center' }}>
              <FaRobot size={24} style={{ display: 'block', margin: '0 auto 1rem', opacity: 0.2 }} />
              No chat history found.
            </div>
          )}
        </HistoryList>
      </Sidebar>
      <style>{`
  .fa-spin {
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`}</style>

      <MainChatArea>
        {/* Mobile Sticky Header */}
        <MobileHeader>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
            <FaBars size={20} />
          </button>
          <span>Lawyer.AI</span>
          <button onClick={handleNewChat} style={{ background: 'none', border: 'none', color: 'white' }}>
            <FaPlus size={20} />
          </button>
        </MobileHeader>

        {!isSidebarOpen && (
          <ToggleBtn onClick={() => setIsSidebarOpen(true)}>
            <FaBars size={18} />
          </ToggleBtn>
        )}

        <MessagesContainer>
          {messages.length === 0 && !loading && (
            <WelcomeScreen>
              <div style={{
                width: '60px', height: '60px', borderRadius: '8px',
                background: '#573cff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem', boxShadow: '0 4px 15px rgba(87, 60, 255, 0.3)'
              }}>
                <FaScaleUnbalanced size={30} color="white" />
              </div>
              <h1>Lawyer.AI</h1>
              <SuggestionsGrid>
                {suggestions.map((s, i) => (
                  <SuggestionCard key={i} onClick={() => handleSend(s.text)}>
                    <h4>{s.title}</h4>
                    <span>"{s.text}"</span>
                  </SuggestionCard>
                ))}
              </SuggestionsGrid>
            </WelcomeScreen>
          )}

          {messages.map((msg, i) => {
            const msgDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
            const prevMsgDate = i > 0 ? (messages[i - 1].timestamp ? new Date(messages[i - 1].timestamp) : new Date()) : null;
            const showDateSeparator = !prevMsgDate || msgDate.toDateString() !== prevMsgDate.toDateString();

            return (
              <React.Fragment key={i}>
                {showDateSeparator && (
                  <DateSeparator>
                    <span>{formatDateLabel(msgDate)}</span>
                  </DateSeparator>
                )}
                <MessageRow $isBot={msg.role === 'bot'}>
                  <MessageContent>
                    <Avatar $isBot={msg.role === 'bot'}>
                      {msg.role === 'bot' ? <FaRobot size={16} /> : (
                        <UserAvatar
                          src={user?.profilePicture || user?.profileImage}
                          name={user?.name}
                          size="30px"
                        />
                      )}
                    </Avatar>
                    <TextBlock>
                      {msg.role === 'bot' ? (
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => {
                              if (props.href && props.href.startsWith('#section-')) {
                                return (
                                  <SectionBadge
                                    href={props.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleSectionClick(props.href);
                                    }}
                                  >
                                    {props.children}
                                  </SectionBadge>
                                );
                              }
                              return <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }} />;
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      )}
                      <MessageTime $user={msg.role === 'user'}>{formatTime(msg.timestamp || Date.now())}</MessageTime>
                    </TextBlock>
                  </MessageContent>
                </MessageRow>
              </React.Fragment>
            );
          })}

          {loading && (
            <MessageRow $isBot={true}>
              <MessageContent>
                <Avatar $isBot={true}><FaRobot size={16} /></Avatar>
                <TextBlock>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '100%' }}>
                    <TypingDot /> <TypingDot /> <TypingDot />
                  </div>
                </TextBlock>
              </MessageContent>
            </MessageRow>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer >

        <InputArea>
          <InputWrapper>
            <TextArea
              ref={inputRef}
              rows={1}
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
            />
            <SendButton onClick={() => handleSend()} disabled={!input.trim() || loading}>
              <FaPaperPlane size={16} />
            </SendButton>
          </InputWrapper>
          <Disclaimer>
            This AI provides informational legal guidance and should not be treated as professional legal advice.
          </Disclaimer>
        </InputArea>

      </MainChatArea >
    </ChatPageLayout >
  );
};

export default ChatPage;
