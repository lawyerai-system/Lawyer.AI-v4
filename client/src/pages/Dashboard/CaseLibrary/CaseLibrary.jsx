import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaMagnifyingGlass, FaPlus, FaGavel, FaStar, FaComments, FaCalendar, FaBuilding, FaTags, FaArrowRight } from 'react-icons/fa6';
import api from '../../../utils/axios';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  width: 100%;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  div {
    h1 {
      font-size: 2.5rem;
      background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    p { color: var(--text-secondary); }
  }
`;

const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
  width: 100%;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 1.2rem 1.5rem 1.2rem 3.5rem;
    border-radius: 16px;
    color: white;
    font-size: 1.05rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);

    &:focus {
      outline: none;
      border-color: var(--primary);
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 0 0 4px rgba(108, 93, 211, 0.15);
      transform: translateY(-2px);
    }
  }

  svg {
    position: absolute;
    left: 1.4rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary);
    font-size: 1.1rem;
  }
`;

const UploadButton = styled(Link)`
  background: var(--primary);
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(108, 93, 211, 0.2);

  &:hover {
    transform: translateY(-2px);
    background: var(--primary-hover);
    box-shadow: 0 15px 30px rgba(108, 93, 211, 0.3);
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 900px;
`;

const FilterChip = styled.button`
  background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const CaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const CaseCard = styled(Link)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 1.5rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(108, 93, 211, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    .arrow-icon { transform: translateX(5px); opacity: 1; }
  }
`;

const CaseBadge = styled.span`
  background: rgba(108, 93, 211, 0.15);
  color: var(--primary);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  width: fit-content;
`;

const CaseTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  color: #fff;
`;

const CaseMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

const CaseSummary = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Stats = styled.div`
  display: flex;
  gap: 1.2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    
    &.starred { color: #fabb18; }
  }
`;

const CaseLibrary = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Criminal', 'Civil', 'Constitutional', 'Corporate', 'Family'];

  useEffect(() => {
    fetchCases();
  }, [search, activeFilter]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      let url = `/api/cases?search=${search}`;
      if (activeFilter !== 'All') url += `&topic=${activeFilter}`;

      const response = await api.get(url);
      setCases(response.data.data);
    } catch (err) {
      console.error("Fetch cases error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>Open Case Library</h1>
          <p>India's collaborative legal research database.</p>
        </div>
        <UploadButton to="upload">
          <FaPlus /> Contribute a Case
        </UploadButton>
      </Header>

      <ActionsRow>
        <SearchBar>
          <FaMagnifyingGlass />
          <input
            type="text"
            placeholder="Search by case title, IPC section, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>

        <FilterSection>
          {filters.map(filter => (
            <FilterChip
              key={filter}
              $active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </FilterChip>
          ))}
        </FilterSection>
      </ActionsRow>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading cases...</div>
      ) : (
        <CaseGrid>
          {cases.map(item => (
            <CaseCard key={item._id} to={item._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CaseBadge>{item.legalTopic}</CaseBadge>
                {item.status === 'PENDING' && (
                  <span style={{ background: 'rgba(255, 185, 0, 0.1)', color: '#ffb900', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    PENDING REVIEW
                  </span>
                )}
              </div>
              <CaseTitle>{item.title}</CaseTitle>
              <CaseMeta>
                <span><FaCalendar /> {item.year}</span>
                <span><FaBuilding /> {item.court}</span>
              </CaseMeta>
              <CaseSummary>{item.aiSummary || item.summary}</CaseSummary>
              <CardFooter>
                <Stats>
                  <span className={item.stars.length > 0 ? 'starred' : ''}><FaStar /> {item.stars.length}</span>
                  <span><FaComments /> {item.comments.length}</span>
                </Stats>
                <div className="arrow-icon" style={{ opacity: 0.5, transition: '0.3s' }}>
                  <FaArrowRight color="var(--primary)" />
                </div>
              </CardFooter>
            </CaseCard>
          ))}
        </CaseGrid>
      )}

      {!loading && cases.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
          <h3>No cases found</h3>
          <p>Try a different search term or filter.</p>
        </div>
      )}
    </Container>
  );
};

export default CaseLibrary;
