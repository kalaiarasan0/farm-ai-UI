import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 250px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.type === 'error' ? '#ffdddd' : '#ddffdd'};
  color: ${props => props.type === 'error' ? '#d8000c' : '#4f8a10'};
  border: 1px solid ${props => props.type === 'error' ? '#d8000c' : '#4f8a10'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-weight: bold;
  cursor: pointer;
  margin-left: 12px;
  font-size: 16px;
`;

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <ToastContainer type={type}>
            <span>{message}</span>
            <CloseButton onClick={onClose}>×</CloseButton>
        </ToastContainer>
    );
};

export default Toast;
