import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: var(--bg-panel);
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  text-align: center;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Title = styled.h3`
  margin-top: 0;
  color: var(--text-main);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border);

  &:hover {
    background: var(--bg-dark);
  }
`;

const PositiveButton = styled(Button)`
  background: ${props => props.type === 'danger' ? '#ef4444' : 'var(--primary)'};
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${props => props.type === 'danger' ? '#dc2626' : 'var(--primary-hover)'};
  }
`;

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName,
  icon, 
  confirmText, 
  type = 'primary' 
}) => {
    if (!isOpen) return null;

    // Default icon for danger type if none provided
    const displayIcon = icon || (type === 'danger' ? '🗑️' : null);

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                {displayIcon && <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{displayIcon}</div>}
                <Title>{title || (type === 'danger' ? 'Delete Item?' : 'Are you sure?')}</Title>
                <Message>
                  {message || (type === 'danger' ? 'This action cannot be undone.' : '')}
                  {itemName && (
                    <div style={{ marginTop: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                      "{itemName}"
                    </div>
                  )}
                </Message>
                <ButtonGroup>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <PositiveButton type={type} onClick={() => { onConfirm(); onClose(); }}>
                        {confirmText || (type === 'danger' ? 'Delete' : 'Confirm')}
                    </PositiveButton>
                </ButtonGroup>
            </ModalContainer>
        </Overlay>
    );
};

export default ConfirmModal;
