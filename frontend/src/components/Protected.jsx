import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Protected({ authentication, children, userType }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        // Don't do anything while loading
        if (loading) return;

        // Case 1: Authentication required but no user
        if (authentication && !user) {
            navigate('/login');
            return;
        }

        // Case 2: Authentication required and user exists but wrong user type
        if (authentication && user && userType && user.userType !== userType) {
            navigate(`/${user.userType}/dashboard`);
            toast.error(`You are not allowed to access ${userType}'s path`);
            return;
        }

        // Case 3: Authentication not required but user exists (optional)
        // You can add logic here if needed

    }, [pathname, user, loading, authentication, navigate, userType]);

    // Show nothing while loading
    if (loading) {
        return null; // or a loading spinner
    }

    // If authentication required and no user, don't render children
    if (authentication && !user) {
        return null;
    }

    // If authentication required and wrong user type, don't render children
    if (authentication && user && userType && user.userType !== userType) {
        return null;
    }

    // Otherwise, render children
    return <>{children}</>;
}

export default Protected;