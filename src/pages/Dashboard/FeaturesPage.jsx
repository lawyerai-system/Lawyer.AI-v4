import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  FaRobot, FaGavel, FaPenNib, FaBook, FaScaleUnbalanced,
  FaUsers, FaShieldHalved, FaLaptop, FaFileSignature,
  FaBrain, FaFileContract, FaChartLine, FaMagnifyingGlass,
  FaComments, FaGraduationCap, FaPeopleGroup, FaCodeBranch
} from 'react-icons/fa6';
import LandingNav from '../../components/Common/LandingNav';
import LandingFooter from '../../components/Common/LandingFooter';
import AIModel from '../../components/Landing/AIModel';
import { useAuth } from '../../context/AuthContext';

const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  background: #0b0d14;
  color: #fff;
  min-height: 100vh;
`;

const PageContainer = styled.div`
  padding: 10rem 2rem 8rem;
  animation: ${fadeIn} 0.8s ease-out;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 8rem;
  
  h1 {
    font-size: 4.5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #fff 0%, #6c5dd3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
  }

  p {
    font-size: 1.35rem;
    color: #a0a3bd;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0.8;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 8rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  .line {
    height: 1px;
    flex: 1;
    background: linear-gradient(90deg, var(--primary) 0%, transparent 100%);
    opacity: 0.3;
  }

  h2 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      color: var(--primary);
      filter: drop-shadow(0 0 10px rgba(108, 93, 211, 0.4));
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(108, 93, 211, 0.5);
    background: rgba(108, 93, 211, 0.03);
    box-shadow: 0 40px 80px rgba(0,0,0,0.4);

    .icon-wrapper {
      transform: scale(1.1) rotate(5deg);
      background: var(--primary);
      color: white;
      box-shadow: 0 10px 30px rgba(108, 93, 211, 0.4);
    }
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: rgba(108, 93, 211, 0.1);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: var(--primary);
    margin-bottom: 2rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
  }

  p {
    color: #a0a3bd;
    line-height: 1.7;
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const featuresData = [
  {
    category: "Legal Research Tools",
    icon: <FaMagnifyingGlass />,
    features: [
      {
        icon: <FaBook />,
        title: "IPC Dictionary",
        description: "A complete, searchable reference for Indian Penal Code sections, translations, and punishments.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaUsers />,
        title: "Open Case Library",
        description: "Explore a massive repository of landmark judgments and study unique, shared legal case files.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaFileContract />,
        title: "Document Analyzer",
        description: "Upload any legal PDF/TXT to instantly extract critical clauses, risks, and relevant laws.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      }
    ]
  },
  {
    category: "AI Legal Assistance",
    icon: <FaRobot />,
    features: [
      {
        icon: <FaComments />,
        title: "Legal AI Chat",
        description: "A 24/7 intelligent assistant providing instant legal insights and explaining complex laws simply.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaChartLine />,
        title: "Strategy Generator",
        description: "Powerful AI that builds strategic defense or prosecution plans based on your case scenario.",
        allowedRoles: ['law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaBrain />,
        title: "Outcome Predictor",
        description: "Proprietary AI model that calculates the winning probability of cases using historical data.",
        allowedRoles: ['lawyer', 'admin']
      }
    ]
  },
  {
    category: "Legal Practice and Training",
    icon: <FaGraduationCap />,
    features: [
      {
        icon: <FaGavel />,
        title: "Moot Court Simulator",
        description: "Practice your arguments in a virtual courtroom with an AI Judge and Opposing Counsel.",
        allowedRoles: ['law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaLaptop />,
        title: "Judicial Simulation",
        description: "Step into the shoes of a judge to analyze cases and deliver ethically sound legal verdicts.",
        allowedRoles: ['lawyer', 'admin']
      },
      {
        icon: <FaCodeBranch />,
        title: "AI Case Builder",
        description: "Transform raw descriptions of legal problems into structured, professional case analyses.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      }
    ]
  },
  {
    category: "Community and Collaboration",
    icon: <FaPeopleGroup />,
    features: [
      {
        icon: <FaShieldHalved />,
        title: "Justice Rooms",
        description: "Encrypted virtual spaces for secure attorney-client interactions and private consultations.",
        allowedRoles: ['civilian', 'lawyer', 'admin']
      },
      {
        icon: <FaPenNib />,
        title: "Legal Case Blogs",
        description: "A hub where top lawyers publish expert insights and users stay informed on legal trends.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      },
      {
        icon: <FaUsers />,
        title: "Role-Based Hubs",
        description: "Customized dashboard experiences tailored for civilians, students, and practitioners.",
        allowedRoles: ['civilian', 'law_student', 'lawyer', 'admin']
      }
    ]
  }
];

const FeaturesPage = () => {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <LandingNav />
      <FixedBackground>
        <AIModel />
      </FixedBackground>
      <ContentContainer>
        <PageContainer>
          <HeroSection>
            <h1>Expertise Redefined</h1>
            <p>Explore our suite of next-generation legal tools designed to empower every citizen, student, and legal practitioner.</p>
          </HeroSection>

          {featuresData.map((cat, catIndex) => (
            <CategorySection key={catIndex}>
              <CategoryHeader>
                <h2>{cat.icon} {cat.category}</h2>
                <div className="line" />
              </CategoryHeader>
              <Grid>
                {cat.features
                  .filter(f => !user || f.allowedRoles.includes(user.role))
                  .map((feature, fIndex) => (
                    <FeatureCard key={fIndex}>
                      <div className="icon-wrapper">
                        {feature.icon}
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </FeatureCard>
                  ))}
              </Grid>
            </CategorySection>
          ))}
        </PageContainer>
        <LandingFooter />
      </ContentContainer>
    </PageWrapper>
  );
};

export default FeaturesPage;
