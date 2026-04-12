import React from 'react';
import CategoryHub from './CategoryHub';
import { FaRobot, FaBook, FaFileLines, FaBrain, FaListCheck, FaGavel, FaMicrochip, FaUserGraduate, FaScaleBalanced, FaNewspaper, FaComments } from 'react-icons/fa6';
import { useAuth } from '../../../context/AuthContext';

const getRolePrefix = (user) => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    const prefixes = {
        'lawyer': '/lawyer',
        'law_student': '/student',
        'civilian': '/civilian'
    };
    return prefixes[user.role] || '/dashboard';
};

export const ResearchHub = () => {
    const { user } = useAuth();
    const prefix = getRolePrefix(user);
    const role = user?.role;
    
    const items = [
        {
            title: "Legal AI Chat",
            description: "Instant answers for complex legal queries using our proprietary AI model.",
            icon: <FaRobot />,
            path: `${prefix}/chat`
        },
        {
            title: "IPC Finder",
            description: "Search and explore the Indian Penal Code with human-readable summaries.",
            icon: <FaBook />,
            path: `${prefix}/ipc`
        }
    ];

    if (role !== 'civilian') {
        items.push({
            title: "Doc Analyzer",
            description: "Upload legal documents to extract key clauses and identify potential risks.",
            icon: <FaFileLines />,
            path: `${prefix}/doc-analyzer`
        });
    }

    return (
        <CategoryHub 
            title="Research Hub" 
            description="Intelligent tools for deep legal research and automated document analysis."
            items={items}
            icon={<FaBrain />}
        />
    );
};

export const PracticeHub = () => {
    const { user } = useAuth();
    const prefix = getRolePrefix(user);
    const role = user?.role;
    
    if (role === 'civilian') return null;

    const items = [
        {
            title: "Case Builder",
            description: "Structure your case and organize evidence with AI-assisted workflows.",
            icon: <FaListCheck />,
            path: `${prefix}/case-builder`
        },
        {
            title: "Strategy Generator",
            description: "Get tactical advice and potential arguments based on case precedents.",
            icon: <FaBrain />,
            path: `${prefix}/strategy-generator`
        }
    ];

    if (role === 'lawyer' || role === 'admin') {
        items.push({
            title: "Outcome Predictor",
            description: "Estimate success probability based on historical case data analysis.",
            icon: <FaGavel />,
            path: `${prefix}/outcome-predictor`
        });
        items.push({
            title: "Judicial Simulation",
            description: "View your case from a judge's perspective to find hidden weaknesses.",
            icon: <FaMicrochip />,
            path: `${prefix}/judicial-simulation`
        });
    }

    return (
        <CategoryHub 
            title="Practice Suite" 
            description="Professional tools for case legal strategy, drafting, and success prediction."
            items={items}
            icon={<FaGavel />}
        />
    );
};

export const AcademyHub = () => {
    const { user } = useAuth();
    const prefix = getRolePrefix(user);
    const role = user?.role;

    if (role === 'civilian') return null;

    const items = [
        {
            title: "Moot Court",
            description: "Practice your advocacy skills in interactive virtual courtroom sessions.",
            icon: <FaUserGraduate />,
            path: `${prefix}/moot-court`
        },
        {
            title: "Case Library",
            description: "Extensive repository of legal precedents and historical judgments.",
            icon: <FaScaleBalanced />,
            path: `${prefix}/case-library`
        }
    ];

    return (
        <CategoryHub 
            title="Legal Academy" 
            description="Sharpen your legal mind with trial simulations and a vast precedent library."
            items={items}
            icon={<FaUserGraduate />}
        />
    );
};

export const CommunityHub = () => {
    const { user } = useAuth();
    const prefix = getRolePrefix(user);
    const role = user?.role;

    const items = [
        {
            title: "Virtual Courtroom",
            description: "Real-time communication and collaborative legal environments.",
            icon: <FaComments />,
            path: `${prefix}/courtroom`
        }
    ];

    if (role !== 'civilian') {
        items.push({
            title: "Legal Blog",
            description: "Stay updated with articles and insights from legal experts.",
            icon: <FaNewspaper />,
            path: `${prefix}/blog`
        });
    }

    return (
        <CategoryHub 
            title="Community Hub" 
            description="Collaborate with peers, discuss cases, and stay informed on legal trends."
            items={items}
            icon={<FaComments />}
        />
    );
};
