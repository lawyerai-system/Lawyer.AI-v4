import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../../context/SettingsContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const BannerContainer = styled.div`
  width: 100%;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: white;
  padding: 8px 16px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  letter-spacing: 0.5px;
`;

const MaintenanceBanner = () => {
    const { isMaintenanceMode } = useSettings();

    React.useEffect(() => {
        if (isMaintenanceMode) {
            document.body.style.paddingTop = '38px';
        } else {
            document.body.style.paddingTop = '0px';
        }
        return () => { document.body.style.paddingTop = '0px'; };
    }, [isMaintenanceMode]);

    if (!isMaintenanceMode) return null;

    return (
        <BannerContainer>
            <FaExclamationTriangle />
            Maintenance Mode Active: Some features may be unavailable.
            <FaExclamationTriangle />
        </BannerContainer>
    );
};

export default MaintenanceBanner;
