import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (user.role !== 'admin') {
        // Role to Dashboard Path mapping
        const dashboardMap = {
            'admin': '/admin',
            'lawyer': '/lawyer/dashboard',
            'law_student': '/student/dashboard',
            'civilian': '/civilian/dashboard'
        };

        const userDashboard = dashboardMap[user.role] || '/dashboard';
        return <Navigate to={userDashboard} replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
