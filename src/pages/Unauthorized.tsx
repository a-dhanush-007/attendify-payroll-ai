
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="max-w-md w-full p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <ShieldAlert className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is a mistake.
        </p>
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-attendify-600 hover:bg-attendify-700"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
