import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Mail, MessageCircle, HelpCircle, Shield, CreditCard, LifeBuoy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import { useAuth } from '../../context/AuthContext';

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 10rem 2rem 8rem;
`;

const BackToHome = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c5dd3;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 2rem;
    transition: all 0.3s;
    width: fit-content;

    &:hover {
        gap: 0.8rem;
        opacity: 0.8;
    }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 6rem;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 4rem;
  
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1.5rem 2rem 1.5rem 3.5rem;
    border-radius: 20px;
    color: white;
    font-size: 1.1rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #6c5dd3;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #686a7d;
  }
`;

const FaqGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FaqItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const Question = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .chevron {
    color: #6c5dd3;
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const Answer = styled(motion.div)`
  padding: 0 2rem 2rem;
  color: #a0a3bd;
  line-height: 1.7;
  font-size: 1rem;
`;

const ContactHub = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 6rem;
  text-align: center;
`;

const HubCard = styled.div`
  background: rgba(108, 93, 211, 0.05);
  padding: 3rem;
  border-radius: 32px;
  border: 1px solid rgba(108, 93, 211, 0.1);
  
  .icon {
    color: #6c5dd3;
    margin-bottom: 1.5rem;
    display: inline-block;
  }

  h4 {
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    font-size: 0.9rem;
    color: #a0a3bd;
  }
`;

const HelpCenterPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openId, setOpenId] = useState(null);

  const handleHomeRedirect = () => {
    if (user) {
      navigate('/login-redirect');
    } else {
      navigate('/');
    }
  };

  const faqs = [
    {
      id: 1,
      q: "Is Lawyer.AI free to use?",
      a: "We offer a generous free tier for basic legal research and IPC code lookups. Advanced AI consultation and document drafting features are part of our premium membership."
    },
    {
      id: 2,
      q: "How accurate is the legal advice?",
      a: "Lawyer.AI uses state-of-the-art Large Language Models trained on extensive legal datasets. While highly accurate, we always recommend consulting with a certified human lawyer for critical legal decisions."
    },
    {
      id: 3,
      q: "Is my data secure?",
      a: "Yes. Every interaction is end-to-end encrypted. We prioritize your confidentiality and never share case details with third parties or use them for training external models."
    },
    {
      id: 4,
      q: "Can I manage multiple cases?",
      a: "Yes, our dashboard allows you to categorize, track, and manage all your legal queries and virtual courtroom sessions in one place."
    }
  ];

  return (
    <PageWrapper>
      <LandingNav />
      <Container>
        <BackToHome onClick={handleHomeRedirect}>
          <ArrowLeft size={16} /> Back to Homepage
        </BackToHome>
        <Hero>
          <HelpCircle size={48} color="#6c5dd3" style={{ marginBottom: '1.5rem' }} />
          <h1>How can we help?</h1>
        </Hero>

        <SearchBox>
          <Search className="search-icon" size={24} />
          <input placeholder="Type keywords like 'billing', 'security'..." />
        </SearchBox>

        <FaqGrid>
          {faqs.map((faq) => (
            <FaqItem key={faq.id}>
              <Question onClick={() => setOpenId(openId === faq.id ? null : faq.id)} $isOpen={openId === faq.id}>
                <h3>{faq.q}</h3>
                <ChevronDown className="chevron" size={20} />
              </Question>
              <AnimatePresence>
                {openId === faq.id && (
                  <Answer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {faq.a}
                  </Answer>
                )}
              </AnimatePresence>
            </FaqItem>
          ))}
        </FaqGrid>

        <ContactHub>
          <HubCard>
            <Mail className="icon" size={32} />
            <h4>Email Support</h4>
            <p>Response within 24 hours</p>
          </HubCard>
          <HubCard>
            <MessageCircle className="icon" size={32} />
            <h4>Live Chat</h4>
            <p>Available 9 AM - 6 PM</p>
          </HubCard>
          <HubCard>
            <LifeBuoy className="icon" size={32} />
            <h4>Community</h4>
            <p>Talk to other users</p>
          </HubCard>
        </ContactHub>
      </Container>
      <LandingFooter />
    </PageWrapper>
  );
};

export default HelpCenterPage;

