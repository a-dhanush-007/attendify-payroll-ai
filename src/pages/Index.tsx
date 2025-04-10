
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Reduce the loading time and improve navigation
  useEffect(() => {
    // If still loading after 2 seconds, navigate to login
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Loading timeout reached, redirecting to login');
        navigate('/login');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-attendify-600 border-attendify-100 animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to login
  console.log("Index page redirecting based on auth state:", isAuthenticated ? "to dashboard" : "to login");
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default Index;
