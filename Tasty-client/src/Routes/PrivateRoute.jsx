import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
import { useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!loading && !user && !toastShownRef.current) {
            toast.error('Please Login');
            toastShownRef.current = true;
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-60 bg-black">
                <span className="loading loading-spinner loading-lg text-orange-600"></span>
            </div>
        );
    }

    if (user) {
        return children;
    }

    return (
        <Navigate to={'/'} state={{ from: location }} replace />
    );
};

export default PrivateRoute;
