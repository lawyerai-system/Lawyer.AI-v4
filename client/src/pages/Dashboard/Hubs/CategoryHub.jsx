import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  
  .title-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .header-icon {
        font-size: 2.2rem;
        color: var(--primary);
    }
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #fff 0%, #a0a3bd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled(Link)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  text-decoration: none;
  color: white;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--primary) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(108, 93, 211, 0.4);
    background: rgba(108, 93, 211, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

    &::before {
      opacity: 0.1;
    }

    .icon-box {
      background: var(--primary);
      color: white;
      transform: scale(1.1);
    }

    .arrow {
      transform: translateX(5px);
      opacity: 1;
    }
  }
`;

const IconBox = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(108, 93, 211, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--primary);
  transition: all 0.3s;
  z-index: 1;
`;

const Content = styled.div`
  z-index: 1;
  h3 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }
  p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 1;

  .arrow {
    transition: transform 0.3s;
    opacity: 0.7;
  }
`;

const CategoryHub = ({ title, description, items, icon }) => {
  return (
    <Container>
      <Header>
        <div className="title-wrap">
          <div className="header-icon">{icon}</div>
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </Header>
      <Grid>
        {items.map((item, index) => (
          <Card key={index} to={item.path}>
            <IconBox className="icon-box">
              {item.icon}
            </IconBox>
            <Content>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Content>
            <Footer>
              Launch Module <FaArrowRight className="arrow" />
            </Footer>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryHub;
