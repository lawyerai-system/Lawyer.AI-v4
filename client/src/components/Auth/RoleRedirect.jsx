import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRedirect = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Role to Dashboard Path mapping
    const dashboardMap = {
        'admin': '/admin',
        'lawyer': '/lawyer',
        'law_student': '/student',
        'civilian': '/civilian'
    };

    const prefix = dashboardMap[user.role] || '/dashboard';
    
    // Get the subpath after /dashboard
    const subPath = location.pathname.startsWith('/dashboard') 
        ? location.pathname.substring('/dashboard'.length) 
        : '';

    // If it's just the root or empty subpath, go to role's dashboard home
    if (!subPath || subPath === '/') {
        return <Navigate to={user.role === 'admin' ? '/admin' : `${prefix}/dashboard`} replace />;
    }

    // Construct final destination, ensuring admin stays in admin panel if no direct mapping exists
    // But for AI tools, we might want to allow them if explicitly mapped later.
    const targetPath = `${prefix}${subPath}`;

    return <Navigate to={targetPath} replace />;
};

export default RoleRedirect;
