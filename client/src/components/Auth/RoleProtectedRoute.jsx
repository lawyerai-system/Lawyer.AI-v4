import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Role to Dashboard Path mapping
    const dashboardMap = {
        'admin': '/admin',
        'lawyer': '/lawyer/dashboard',
        'law_student': '/student/dashboard',
        'civilian': '/civilian/dashboard'
    };

    const userDashboard = dashboardMap[user.role] || '/dashboard';

    // Check if user has the required role
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to={userDashboard} replace />;
    }

    // Special check for Lawyers: Must be APPROVED to access protected professional features
    // We allow 'admin' to bypass this check generally for testing/management
    if (user.role === 'lawyer' && user.verificationStatus !== 'APPROVED' && user.role !== 'admin') {
        // If they are a lawyer but not approved, redirect back to their dashboard
        return <Navigate to={userDashboard} replace />;
    }

    return children;
};

export default RoleProtectedRoute;
