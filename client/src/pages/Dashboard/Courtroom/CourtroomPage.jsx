import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useChatContext } from '../../../context/ChatContext';
import { useSocketContext } from '../../../context/SocketContext';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  
  &.contact-pane {
    position: sticky;
    top: 80px;
    height: calc(100vh - 80px);
    width: 300px;
    border-right: 1px solid rgba(255,255,255,0.1);
    background: var(--bg-panel);
    overflow-y: auto;
  }

  &.chat-pane {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: 1;
    display: ${props => props.$showOnMobile ? 'flex' : 'none'};
    
    &.contact-pane {
        position: relative;
        top: 0;
        height: auto;
        min-height: calc(100vh - 80px);
        width: 100%;
        border-right: none;
    }
  }
`;

const CourtroomPage = () => {
  const { fetchContacts, chatId } = useChatContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Listen for socket events that should trigger contact refresh
  useEffect(() => {
    if (socket) {
      socket.on('CHAT_ROOM_NOTIFY', () => fetchContacts());
      // INVITED_TO_ROOM is no longer needed but keeping it harmlessly or removing it is fine
      return () => {
        socket.off('CHAT_ROOM_NOTIFY');
      }
    }
  }, [socket, fetchContacts]);

  return (
    <Container>
      <Pane className="contact-pane" $showOnMobile={!chatId}>
        <ContactList />
      </Pane>
      <Pane className="chat-pane" $showOnMobile={!!chatId}>
        <ChatWindow />
      </Pane>
    </Container>
  );
};

export default CourtroomPage;
