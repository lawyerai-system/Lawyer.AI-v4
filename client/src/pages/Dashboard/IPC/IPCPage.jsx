import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/axios'; // Use configured instance
import { FaSearch, FaBook, FaGavel, FaExclamationTriangle } from 'react-icons/fa';

const PageContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 3rem 2rem;
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  gap: 3rem;
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  position: relative;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 8px 32px rgba(118, 75, 162, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    border-radius: 15px;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-right: 1rem;
  
  @media (max-width: 480px) {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 1.1rem;
  padding: 1rem 0;
  outline: none;
  min-width: 0; /* Fix flex overflow */

  &::placeholder {
    color: var(--text-secondary);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.8rem 0;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-left: 0.5rem;
  flex-shrink: 0; /* Prevent button from shrinking too much */

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding-bottom: 2rem;
`;

const ResultCard = styled.div`
  background: rgba(30, 30, 40, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--primary);
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span`
  background: ${props => props.$bailable ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)'};
  color: ${props => props.$bailable ? '#48bb78' : '#f56565'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.p`
  font-size: 1rem;
  color: var(--text-main);
  line-height: 1.5;
  margin: 0;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-top: auto;
`;

const StatusMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-secondary);
  padding: 4rem;
  background: var(--bg-panel);
  border-radius: 16px;
  border: 1px dashed var(--border);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: var(--danger, #f56565);
    color: white;
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.5rem;
`;

const ModalSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    color: var(--primary);
    font-size: 1.1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-bottom: 2rem;
  flex-wrap: wrap; /* Allow wrapping on small screens */

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const PageButton = styled.button`
  background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--text-main)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--border)'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;

  &:hover {
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    min-width: 32px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeIn 0.5s ease;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  margin-left: 0.5rem;
`;

const Select = styled.select`
  background: var(--bg-panel);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  min-width: 220px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }

  option {
    background: var(--bg-secondary);
    color: var(--text-main);
  }
`;

const TypeBadge = styled.span`
  background: rgba(118, 75, 162, 0.15);
  color: #b794f4;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(118, 75, 162, 0.3);
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  svg {
    font-size: 1.2rem;
  }
`;

const SectionContent = styled.div`
  color: var(--text-main);
  line-height: 1.7;
  font-size: 1rem;
  
  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const IPCPage = () => {
  const [query, setQuery] = useState('');
  const [crimeType, setCrimeType] = useState('All');
  const [punishmentRange, setPunishmentRange] = useState('All');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIPC, setSelectedIPC] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Increased for better layout
  const { token } = useAuth();

  const crimeTypes = [
    "Violent Crimes (Major)",
    "Violent Crimes (Minor/General)",
    "Sexual/Women Related",
    "Crimes Against Children",
    "Financial/Property Crimes",
    "Against State/Public Authority",
    "Public Order & Safety",
    "False Evidence/Justice",
    "General/Other"
  ];

  const punishmentRanges = [
    "Very Short (< 1 Year)",
    "Short (1 - 3 Years)",
    "Medium (3 - 7 Years)",
    "Long (7 - 14 Years)",
    "Life Imprisonment / Death"
  ];

  const handleSearch = async (e) => {
    e?.preventDefault();

    setLoading(true);
    setHasSearched(true);
    setResults([]);
    setError(null);
    setSelectedIPC(null);
    setCurrentPage(1);

    try {
      const response = await api.get(`/api/ipc/search`, {
        params: {
          query: query.trim() || undefined,
          crimeType: crimeType !== 'All' ? crimeType : undefined,
          punishmentRange: punishmentRange !== 'All' ? punishmentRange : undefined
        }
      });

      if (response.data.status === 'success') {
        setResults(response.data.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Handled by empty results display
      } else {
        console.error("Search Error:", err);
        setError("An error occurred while connecting to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (ipc) => {
    setSelectedIPC(ipc);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedIPC(null);
    document.body.style.overflow = 'unset';
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of results
    const resultsElement = document.getElementById('results-start');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageContainer
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <HeaderSection>
        <Title>Smart IPC Finder</Title>
        <Subtitle>
          Advanced Indian Penal Code search system. Use natural language to describe a crime or search specifically by section and category.
        </Subtitle>
      </HeaderSection>

      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchInputWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="E.g. 'Someone threatened me online' or 'Section 302'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchButton type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </SearchButton>
          </SearchInputWrapper>

          <FiltersContainer>
            <FilterGroup>
              <FilterLabel>Crime Category</FilterLabel>
              <Select value={crimeType} onChange={(e) => setCrimeType(e.target.value)}>
                <option value="All">All Categories</option>
                {crimeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Punishment Length</FilterLabel>
              <Select value={punishmentRange} onChange={(e) => setPunishmentRange(e.target.value)}>
                <option value="All">Any Duration</option>
                {punishmentRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersContainer>
        </form>
      </SearchContainer>

      <div id="results-start" style={{ scrollMarginTop: '2rem' }}></div>

      {loading ? (
        <StatusMessage>Searching the legal database...</StatusMessage>
      ) : error ? (
        <StatusMessage style={{ border: '1px solid #ff6b6b', color: '#ff4444' }}>
          <FaExclamationTriangle style={{ marginBottom: '0.5rem', fontSize: '2rem' }} /> <br />
          {error}
        </StatusMessage>
      ) : results.length > 0 ? (
        <>
          <ResultsGrid>
            {currentItems.map((ipc) => (
              <ResultCard
                key={ipc._id}
                onClick={() => openModal(ipc)}
                style={{ cursor: 'pointer' }}
              >
                <CardHeader>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <SectionTitle>
                      <FaBook size={18} />
                      {ipc.section}
                    </SectionTitle>
                    {ipc.crimeType && <TypeBadge>{ipc.crimeType}</TypeBadge>}
                  </div>
                  {ipc.bailable && (
                    <Badge $bailable={ipc.bailable.toLowerCase().includes('bailable') && !ipc.bailable.toLowerCase().includes('non-bailable')}>
                      {ipc.bailable}
                    </Badge>
                  )}
                </CardHeader>

                <InfoRow>
                  <Label><FaExclamationTriangle size={12} /> Offence</Label>
                  <Content style={{ fontWeight: 600 }}>{ipc.offence || 'Not specified'}</Content>
                </InfoRow>

                <InfoRow>
                  <Label><FaGavel size={12} /> Punishment</Label>
                  <Content>{ipc.punishment || 'Not specified'}</Content>
                </InfoRow>

                <Description>
                  {ipc.description?.length > 120
                    ? ipc.description.substring(0, 120) + '...'
                    : ipc.description}
                  <span style={{ color: 'var(--primary)', fontSize: '0.8rem', marginLeft: '0.5rem', fontWeight: 700 }}>Full Details &rarr;</span>
                </Description>
              </ResultCard>
            ))}
          </ResultsGrid>

          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt; Prev
              </PageButton>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <PageButton
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    $active={currentPage === pageNum}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}

              <PageButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </PageButton>
            </PaginationContainer>
          )}
        </>
      ) : hasSearched ? (
        <StatusMessage>
          No results found for your search. <br />
          <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>Try adjusting your filters or describe the situation in more detail.</span>
        </StatusMessage>
      ) : (
        <StatusMessage>
          Enter a search term or use the filters above to explore the Indian Penal Code.
        </StatusMessage>
      )}

      {selectedIPC && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>

            <ModalBody>
              <ModalHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <SectionTitle style={{ fontSize: '2.5rem' }}>
                    <FaBook /> {selectedIPC.section}
                  </SectionTitle>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {selectedIPC.crimeType && <TypeBadge style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>{selectedIPC.crimeType}</TypeBadge>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {selectedIPC.natureOfOffence && (
                    <Badge $bailable={true} style={{ background: 'rgba(66, 153, 225, 0.2)', color: '#63b3ed' }}>
                      {selectedIPC.natureOfOffence.split('\n')[0]}
                    </Badge>
                  )}
                  {selectedIPC.bailable && (
                    <Badge $bailable={selectedIPC.bailable.toLowerCase().includes('bailable') && !selectedIPC.bailable.toLowerCase().includes('non-bailable')}>
                      {selectedIPC.bailable}
                    </Badge>
                  )}
                </div>
              </ModalHeader>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <ModalSection>
                  <CategoryHeader><FaExclamationTriangle /> Offence</CategoryHeader>
                  <SectionContent style={{ fontWeight: 600 }}>{selectedIPC.offence || 'Not specified'}</SectionContent>
                </ModalSection>

                <ModalSection>
                  <CategoryHeader><FaGavel /> Punishment</CategoryHeader>
                  <SectionContent>{selectedIPC.punishment || 'Not specified'}</SectionContent>
                </ModalSection>
              </div>

              {selectedIPC.summary && (
                <ModalSection style={{ background: 'rgba(118, 75, 162, 0.05)', border: '1px solid rgba(118, 75, 162, 0.2)' }}>
                  <CategoryHeader><FaBook /> Executive Summary</CategoryHeader>
                  <SectionContent>{selectedIPC.summary}</SectionContent>
                </ModalSection>
              )}

              <ModalSection>
                <CategoryHeader><FaBook /> Detailed Description</CategoryHeader>
                <SectionContent style={{ whiteSpace: 'pre-line' }}>{selectedIPC.description || 'No description available.'}</SectionContent>
              </ModalSection>

              {selectedIPC.consequences && (
                <ModalSection>
                  <CategoryHeader>⚖️ Key Consequences</CategoryHeader>
                  <SectionContent style={{ whiteSpace: 'pre-line' }}>{selectedIPC.consequences}</SectionContent>
                </ModalSection>
              )}

              {selectedIPC.solutions && (
                <ModalSection>
                  <CategoryHeader>💡 Legal Solutions & Remedies</CategoryHeader>
                  <SectionContent style={{ whiteSpace: 'pre-line' }}>{selectedIPC.solutions}</SectionContent>
                </ModalSection>
              )}

              {selectedIPC.suggestions && (
                <ModalSection>
                  <CategoryHeader>📝 Expert Suggestions</CategoryHeader>
                  <SectionContent style={{ whiteSpace: 'pre-line' }}>{selectedIPC.suggestions}</SectionContent>
                </ModalSection>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default IPCPage;
