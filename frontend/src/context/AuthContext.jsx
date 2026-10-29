import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Restore user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("userInfo");
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
