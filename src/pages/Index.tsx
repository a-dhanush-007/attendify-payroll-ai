
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Reduce the loading time by directly redirecting after a short timeout
  if (isLoading) {
    // After 2 seconds, redirect to login if still loading
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log('Loading timeout reached, redirecting to login');
          window.location.href = '/login';
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }, [isLoading]);

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
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export default Index;
