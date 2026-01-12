import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../types';
import { authService } from '../../services/apiService';

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initial check (not fully robust for demo, improvements needed for persistence)
        const token = localStorage.getItem('token');
        if (token) {
            // ideally validating token with backend
        }
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        try {
            const userData = await authService.login(email);
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
