import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import { toast } from 'react-hot-toast';
import { FaSave, FaCog, FaToggleOn, FaToggleOff, FaFolderOpen, FaServer, FaPlus, FaTimes } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const Section = styled.div`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);

  @media (min-width: 640px) {
    padding: 2rem;
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  color: var(--primary);

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  svg { opacity: 0.8; }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
  gap: 1rem;

  .info {
    display: flex;
    flex-direction: column;
    span { font-weight: 600; font-size: 0.9rem; @media (min-width: 640px) { font-size: 0.95rem; } }
    small { color: var(--text-secondary); font-size: 0.75rem; margin-top: 2px; line-height: 1.4; @media (min-width: 640px) { font-size: 0.8rem; } }
  }
`;

const Toggle = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.active ? 'var(--primary)' : '#4b5563'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (min-width: 640px) {
    font-size: 1.75rem;
  }

  &:hover { transform: scale(1.1); }
`;

const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`;

const Tag = styled.div`
  background: rgba(108, 93, 211, 0.1);
  color: var(--primary);
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(108, 93, 211, 0.2);

  @media (min-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    padding: 0;
    opacity: 0.6;
    &:hover { opacity: 1; }
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    padding: 0.75rem 1rem;
    border-radius: 12px;
    color: white;
    font-size: 0.9rem;
    &:focus { outline: none; border-color: var(--primary); }
  }
`;

const ActionBtn = styled.button`
  background: ${props => props.variant === 'primary' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'};
  color: white;
  border: 1px solid ${props => props.variant === 'primary' ? 'var(--primary)' : 'var(--border)'};
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  &:hover {
    background: ${props => props.variant === 'primary' ? '#5a4db8' : 'rgba(255,255,255,0.1)'};
    transform: translateY(-2px);
  }
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title-area {
    h1 { margin: 0; font-size: 1.8rem; @media (min-width: 640px) { font-size: 2rem; } }
    p { color: var(--text-secondary); margin: 5px 0 0; font-size: 0.9rem; }
  }

  button {
    width: 100%;
    @media (min-width: 640px) {
      width: auto;
    }
  }
`;

const SettingsManagement = () => {
  const [generalSettings, setGeneralSettings] = useState(null);
  const [aiFeaturesEnabled, setAiFeaturesEnabled] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ blog: '', library: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/admin/settings');
      if (res.data.success) {
        setGeneralSettings(res.data.data.general);
        setAiFeaturesEnabled(res.data.data.aiFeaturesEnabled);
        setIsMaintenanceMode(res.data.data.isMaintenanceMode || false);
      }
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAiToggle = async () => {
    const newState = !aiFeaturesEnabled;
    try {
      const res = await api.put('/api/admin/settings/ai-toggle', { enabled: newState });
      if (res.data.success) {
        setAiFeaturesEnabled(newState);
        toast.success(`AI features ${newState ? 'enabled' : 'disabled'} globally`);
      }
    } catch (err) {
      toast.error("Failed to update AI toggle");
    }
  };

  const handleMaintenanceToggle = async () => {
    const newState = !isMaintenanceMode;
    try {
      const res = await api.put('/api/admin/settings/maintenance-toggle', { enabled: newState });
      if (res.data.success) {
        setIsMaintenanceMode(newState);
        toast.success(`Maintenance Mode ${newState ? 'enabled' : 'disabled'} successfully`);
      }
    } catch (err) {
      toast.error("Failed to update Maintenance Mode");
    }
  };

  const handleToggle = (feature) => {
    setGeneralSettings({
      ...generalSettings,
      features: {
        ...generalSettings.features,
        [feature]: !generalSettings.features[feature]
      }
    });
  };

  const handleAddCategory = (type) => {
    if (!newCat[type].trim()) return;
    const catList = type === 'blog' ? 'blog' : 'caseLibrary';
    if (generalSettings.categories[catList].includes(newCat[type].trim())) {
      return toast.error("Category already exists");
    }

    setGeneralSettings({
      ...generalSettings,
      categories: {
        ...generalSettings.categories,
        [catList]: [...generalSettings.categories[catList], newCat[type].trim()]
      }
    });
    setNewCat({ ...newCat, [type]: '' });
  };

  const handleRemoveCategory = (type, category) => {
    const catList = type === 'blog' ? 'blog' : 'caseLibrary';
    setGeneralSettings({
      ...generalSettings,
      categories: {
        ...generalSettings.categories,
        [catList]: generalSettings.categories[catList].filter(c => c !== category)
      }
    });
  };

  const handleSave = async () => {
    try {
      const res = await api.patch('/api/admin/settings', generalSettings);
      if (res.data.success) {
        toast.success("General settings saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  if (loading || !generalSettings) return <div>Loading settings...</div>;

  return (
    <Container>
      <SettingsHeader>
        <div className="title-area">
          <h1>Platform Settings</h1>
          <p>Manage global feature toggles and configurations.</p>
        </div>
        <ActionBtn variant="primary" onClick={handleSave}>
          <FaSave /> Save Changes
        </ActionBtn>
      </SettingsHeader>

      <Section style={{ border: '2px solid' + (aiFeaturesEnabled ? 'var(--primary)' : '#ef4444'), background: aiFeaturesEnabled ? '' : 'rgba(239, 68, 68, 0.05)' }}>
        <SectionTitle style={{ color: aiFeaturesEnabled ? 'var(--primary)' : '#ef4444' }}>
          <FaServer /> Global AI Master Switch
        </SectionTitle>
        <SettingItem style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)' }}>
          <div className="info">
            <span style={{ fontSize: '1.1rem' }}>Enable AI Features Across Platform</span>
            <small>Turning this OFF will immediately disable all AI-powered tools (Chat, Predicton, Strategy, etc.) for all users.</small>
          </div>
          <Toggle active={aiFeaturesEnabled} onClick={handleAiToggle}>
            {aiFeaturesEnabled ? <FaToggleOn size={40} /> : <FaToggleOff size={40} />}
          </Toggle>
        </SettingItem>
      </Section>

      <Section style={{ border: '2px solid' + (isMaintenanceMode ? '#f59e0b' : 'var(--border)'), background: isMaintenanceMode ? 'rgba(245, 158, 11, 0.05)' : '' }}>
        <SectionTitle style={{ color: isMaintenanceMode ? '#f59e0b' : 'var(--primary)' }}>
          <FaCog /> Maintenance Mode
        </SectionTitle>
        <SettingItem style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)' }}>
          <div className="info">
            <span style={{ fontSize: '1.1rem' }}>Enable Maintenance Mode</span>
            <small>When active, users can explore public pages but will see a popup when trying to use protected features (Chat, Strategies, etc.).</small>
          </div>
          <Toggle active={isMaintenanceMode} onClick={handleMaintenanceToggle}>
            {isMaintenanceMode ? <FaToggleOn size={40} color="#f59e0b" /> : <FaToggleOff size={40} />}
          </Toggle>
        </SettingItem>
      </Section>

      <Section>
        <SectionTitle><FaToggleOn /> Feature Toggles</SectionTitle>
        <SettingsGrid>
          {Object.entries({
            legalAI: ['Legal AI', 'Main chat assistant'],
            docAnalyzer: ['Document Analyzer', 'AI clause extraction'],
            strategyGenerator: ['Strategy Gen', 'Tactical advice generator'],
            mootCourt: ['Moot Court', 'Virtual trial practice'],
            outcomePredictor: ['Case Predictor', 'Success probability engine'],
            judicialSimulation: ['Simulation', 'Judicial perspective simulation']
          }).map(([key, [label, desc]]) => (
            <SettingItem key={key}>
              <div className="info">
                <span>{label}</span>
                <small>{desc}</small>
              </div>
              <Toggle active={generalSettings.features[key]} onClick={() => handleToggle(key)}>
                {generalSettings.features[key] ? <FaToggleOn /> : <FaToggleOff />}
              </Toggle>
            </SettingItem>
          ))}
        </SettingsGrid>
      </Section>

      <Section>
        <SectionTitle><FaFolderOpen /> Blog Categories</SectionTitle>
        <CategoryBox>
          {generalSettings.categories.blog.map(cat => (
            <Tag key={cat}>{cat} <button onClick={() => handleRemoveCategory('blog', cat)}><FaTimes size={10} /></button></Tag>
          ))}
        </CategoryBox>
        <InputGroup>
          <input
            placeholder="Add new blog category..."
            value={newCat.blog}
            onChange={(e) => setNewCat({ ...newCat, blog: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('blog')}
          />
          <ActionBtn onClick={() => handleAddCategory('blog')}><FaPlus /> Add</ActionBtn>
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle><FaFolderOpen /> Case Library Categories</SectionTitle>
        <CategoryBox>
          {generalSettings.categories.caseLibrary.map(cat => (
            <Tag key={cat}>{cat} <button onClick={() => handleRemoveCategory('library', cat)}><FaTimes size={10} /></button></Tag>
          ))}
        </CategoryBox>
        <InputGroup>
          <input
            placeholder="Add new library category..."
            value={newCat.library}
            onChange={(e) => setNewCat({ ...newCat, library: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('library')}
          />
          <ActionBtn onClick={() => handleAddCategory('library')}><FaPlus /> Add</ActionBtn>
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle><FaServer /> System Defaults</SectionTitle>
        <SettingsGrid>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Max Upload Size (MB)</label>
            <input
              type="number"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.8rem', borderRadius: '12px', color: 'white' }}
              value={generalSettings.systemDefaults.maxUploadSize}
              onChange={(e) => setGeneralSettings({ ...generalSettings, systemDefaults: { ...generalSettings.systemDefaults, maxUploadSize: parseInt(e.target.value) } })}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Items Per Page (Admin Lists)</label>
            <input
              type="number"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.8rem', borderRadius: '12px', color: 'white' }}
              value={generalSettings.systemDefaults.itemsPerPage}
              onChange={(e) => setGeneralSettings({ ...generalSettings, systemDefaults: { ...generalSettings.systemDefaults, itemsPerPage: parseInt(e.target.value) } })}
            />
          </div>
        </SettingsGrid>
      </Section>
    </Container>
  );
};

export default SettingsManagement;

