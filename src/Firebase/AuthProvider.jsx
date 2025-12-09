import React, { createContext, useEffect, useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    updateProfile
} from "firebase/auth";
import app from "../firebase/firebase.config";

// Create Auth Context
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const auth = getAuth(app);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register user with email + password
    const registerUserWithEmailPassword = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login user with email + password
    const loginUserWithEmailPassword = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUserProfile = (info) => {
        return updateProfile(auth.currentUser, info);
    };

    // Logout
    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Firebase Auth Observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        registerUserWithEmailPassword,
        loginUserWithEmailPassword,
        logoutUser,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
