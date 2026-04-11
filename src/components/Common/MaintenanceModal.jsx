import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationCircle } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
`;

const ModalBox = styled.div`
  background: #1a1a1a;
  border: 2px solid #ef4444;
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #a0aec0;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
  }
`;

const MaintenanceModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const handleMaintenanceAlert = (event) => {
            setMessage(event.detail || "Platform is under maintenance. This feature is temporarily unavailable.");
            setIsOpen(true);
        };

        window.addEventListener('maintenance-alert', handleMaintenanceAlert);
        return () => window.removeEventListener('maintenance-alert', handleMaintenanceAlert);
    }, []);

    if (!isOpen) return null;

    return (
        <Overlay onClick={() => setIsOpen(false)}>
            <ModalBox onClick={e => e.stopPropagation()}>
                <IconWrapper>
                    <FaExclamationCircle />
                </IconWrapper>
                <Title>Maintenance Alert</Title>
                <Message>{message}</Message>
                <CloseButton onClick={() => setIsOpen(false)}>Understood</CloseButton>
            </ModalBox>
        </Overlay>
    );
};

export default MaintenanceModal;
