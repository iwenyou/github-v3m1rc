import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { verifyToken, updateUser } from '../services/authService';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
  updateUserProfile: (updates: Partial<Omit<User, 'password'>>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  const updateUserProfile = async (updates: Partial<Omit<User, 'password'>>) => {
    if (!user?.id) return;
    
    try {
      const updatedUser = await updateUser(user.id, updates);
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = verifyToken(token);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          name: '',
          role: decoded.role,
          createdAt: '',
          updatedAt: ''
        });
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}