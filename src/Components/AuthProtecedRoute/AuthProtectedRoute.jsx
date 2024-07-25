import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../../Contexts/AuthContext';

export default function AuthProtectedRoute({ children }) {
    const { setUserIsLoggedIn, userIsLoggedIn } = useContext(authContext);

    useEffect(() => {
        // Check if token exists in sessionStorage
        const token = sessionStorage.getItem('token');
        if (token) {
            setUserIsLoggedIn(true);
        } else {
            setUserIsLoggedIn(false);
        }
    }, [setUserIsLoggedIn]);

    return (
        <>
            {userIsLoggedIn ? children : <Navigate to={'/Try'} />}
        </>
    );
}
