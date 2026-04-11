import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MaintenanceWatcher = () => {
    const { user, logout } = useAuth();
    const { isMaintenanceMode, loading: settingsLoading } = useSettings();
    const navigate = useNavigate();

    useEffect(() => {
        // Debugging logs
        console.log("[MaintenanceWatcher] State:", { isMaintenanceMode, user, settingsLoading });

        // Wait until settings are loaded
        if (settingsLoading) return;

        // Reset padding if NOT in maintenance (Banner also does this, but safely redundant here)
        if (!isMaintenanceMode) {
            document.body.style.paddingTop = '0px';
        }

        // Logic check
        if (isMaintenanceMode && user && user.role !== 'admin') {
            console.warn("[MaintenanceWatcher] Active maintenance detected for non-admin user. Logging out...");

            // 1. Perform Logout (Clears context & localStorage)
            logout();

            // 2. Redirect to landing
            navigate('/', { replace: true });

            // 3. Notify user
            toast.error("You have been logged out due to scheduled maintenance.", {
                id: 'maintenance-logout',
                duration: 6000,
                icon: '🕒'
            });
        }
    }, [isMaintenanceMode, settingsLoading, user, logout, navigate]);

    return null; // This component doesn't render anything
};

export default MaintenanceWatcher;
