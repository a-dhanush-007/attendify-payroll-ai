
import { supabase } from '@/integrations/supabase/client';

// Function to create a demo user if they don't exist
export const createDemoUserIfNeeded = async (email: string, password: string, role: string, name: string) => {
  try {
    // Check if the user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (!existingUser) {
      // Make a call to the create-account serverless function
      const response = await fetch(
        'https://oaockrwpzfamwrkzpapb.supabase.co/functions/v1/create-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`,
          },
          body: JSON.stringify({
            email,
            password,
            role,
            name
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Failed to create demo user ${email}:`, errorData);
        // Don't throw an error here, we'll try to login anyway
      } else {
        console.log(`Demo user ${email} created successfully`);
      }
    } else {
      console.log(`Demo user ${email} already exists`);
    }
  } catch (error) {
    console.error(`Error checking/creating demo user ${email}:`, error);
    // Don't throw an error, we'll try to login anyway
  }
};

// Function to set up all demo users
export const setupDemoUsers = async () => {
  const demoUsers = [
    { email: 'admin@example.com', password: 'password123', role: 'admin', name: 'Admin User' },
    { email: 'supervisor@example.com', password: 'password123', role: 'supervisor', name: 'Supervisor User' },
    { email: 'builder@example.com', password: 'password123', role: 'builder', name: 'Builder User' }
  ];
  
  for (const user of demoUsers) {
    await createDemoUserIfNeeded(user.email, user.password, user.role, user.name);
  }
};
