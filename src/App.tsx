
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import AppShell from "./components/Layout/AppShell";

// Eagerly load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Payroll = lazy(() => import("./pages/Payroll"));
const Workers = lazy(() => import("./pages/Workers"));

// Auth components
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-full border-4 border-t-attendify-600 border-attendify-100 animate-spin"></div>
      <p className="mt-4 text-lg font-medium">Loading page...</p>
    </div>
  </div>
);

// Configure React Query with shorter timeouts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
      cacheTime: 60000,
      retryDelay: 1000,
      timeout: 10000
    }
  }
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                <Route path="/dashboard" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="/attendance" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Attendance />
                  </Suspense>
                } />
                <Route path="/payroll" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Payroll />
                  </Suspense>
                } />
                <Route path="/workers" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Workers />
                  </Suspense>
                } />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
