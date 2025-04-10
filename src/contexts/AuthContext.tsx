
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Fetch user profile data to get role information
            const profile = await fetchUserProfile(currentSession.user.id);
              
            if (profile) {
              setUser({
                id: currentSession.user.id,
                email: profile.email || currentSession.user.email,
                name: profile.name,
                role: profile.role as UserRole,
                created_at: profile.created_at
              });
              console.log("User profile loaded:", profile);
            } else {
              // If no profile exists, we'll set minimal user data
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.name || '',
                role: (currentSession.user.user_metadata?.role as UserRole) || 'builder',
                created_at: new Date().toISOString()
              });
              console.log("No profile found, using minimal user data");
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Session found" : "No session");
        
        if (initialSession?.user) {
          const profile = await fetchUserProfile(initialSession.user.id);
            
          if (profile) {
            setUser({
              id: initialSession.user.id,
              email: profile.email || initialSession.user.email,
              name: profile.name,
              role: profile.role as UserRole,
              created_at: profile.created_at
            });
            console.log("Initial user profile loaded:", profile);
          } else {
            // If no profile exists, we'll set minimal user data
            setUser({
              id: initialSession.user.id,
              email: initialSession.user.email || '',
              name: initialSession.user.user_metadata?.name || '',
              role: (initialSession.user.user_metadata?.role as UserRole) || 'builder',
              created_at: new Date().toISOString()
            });
            console.log("No profile found during initialization, using minimal user data");
          }
          
          setSession(initialSession);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      console.log("Sign in successful:", data);
      
      // We don't need to navigate here - the auth state change listener will handle it
      // The onAuthStateChange event will trigger and update the user state
      
    } catch (error) {
      const authError = error as AuthError;
      console.error('Login error:', authError);
      
      let errorMessage = 'Failed to sign in. Please check your credentials and try again.';
      
      // Provide more specific error messages for common scenarios
      if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before signing in.';
      } else if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password.';
      }
      
      toast({
        title: "Authentication error",
        description: errorMessage,
        variant: "destructive"
      });
      
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive"
      });
    }
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
    session,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
