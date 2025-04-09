
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock authentication - this would be replaced with Supabase auth
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('attendify_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation - replace with Supabase auth
      // In a real app, we'd validate credentials against Supabase
      
      // For demo purposes, we'll check specific email patterns to determine role
      let role: UserRole;
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('supervisor')) {
        role = 'supervisor';
      } else {
        role = 'builder';
      }
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        role,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('attendify_user', JSON.stringify(mockUser));
      setUser(mockUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('attendify_user');
    setUser(null);
    navigate('/login');
  };

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
