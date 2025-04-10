
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Submitting login form with email:", values.email);
      await signIn(values.email, values.password);
      toast({
        title: 'Login successful',
        description: 'Welcome to AttendifyPro!',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login submit error:', error);
      // Error messages are handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setIsLoading(true);
    form.setValue("email", email);
    form.setValue("password", "password123");
    
    try {
      await signIn(email, "password123");
      toast({
        title: 'Demo login successful',
        description: `Welcome to AttendifyPro as ${email}!`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
      // Explicitly handle demo login errors
      toast({
        title: 'Login failed',
        description: 'Could not log in with demo credentials. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-attendify-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-attendify-600 rounded-lg shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-attendify-800 dark:text-attendify-300">
              AttendifyPro
            </h1>
          </div>
        </div>
        
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link to="#" className="text-xs text-attendify-600 hover:text-attendify-800 dark:text-attendify-400 dark:hover:text-attendify-300">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-attendify-600 hover:bg-attendify-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button variant="link" className="p-0 h-auto font-semibold text-attendify-600 hover:text-attendify-800">
                Create an account
              </Button>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <p>Demo login:</p>
              <div className="flex justify-center space-x-2 mt-1">
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("admin@example.com")} disabled={isLoading}>
                  Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("supervisor@example.com")} disabled={isLoading}>
                  Supervisor
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDemoLogin("builder@example.com")} disabled={isLoading}>
                  Builder
                </Button>
              </div>
              <p className="mt-1">Password: password123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
