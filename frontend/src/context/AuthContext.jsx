import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    const apiRequest = async (endpoint, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(`http://localhost:5000/api${endpoint}`, { ...options, headers });
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, apiRequest }}>
            {children}
        </AuthContext.Provider>
    );
};