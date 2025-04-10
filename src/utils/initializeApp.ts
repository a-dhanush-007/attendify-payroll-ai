
import { supabase } from '@/integrations/supabase/client';

export const setupDemoAccounts = async () => {
  try {
    const response = await fetch(
      'https://oaockrwpzfamwrkzpapb.supabase.co/functions/v1/setup-demo-users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use the anon key for this request
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hb2NrcndwemZhbXdya3pwYXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI5NTYsImV4cCI6MjA1OTc4ODk1Nn0.07c9GOURkVguhAFBuQQSyRRAiNP-W3CrFjzcZZSlDdg`
        },
        body: JSON.stringify({})
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to set up demo accounts:', errorData);
    } else {
      const data = await response.json();
      console.log('Demo accounts setup completed:', data);
    }
  } catch (error) {
    console.error('Error setting up demo accounts:', error);
  }
};
