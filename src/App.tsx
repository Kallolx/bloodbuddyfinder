import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FindDonors from "./pages/FindDonors";
import RequestBlood from "./pages/RequestBlood";
import RegisterDonor from "./pages/RegisterDonor";
import Admin from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import React, { useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  // Create a client inside the component
  const [queryClient] = React.useState(() => new QueryClient());

  // Force the default dark theme by removing any 'light' class if present
  useEffect(() => {
    // The colors are already set for dark in :root, so we don't need to add 'dark' class
    // Just ensure 'light' class is removed if present
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/find-donors" element={<FindDonors />} />
              <Route path="/request-blood" element={<RequestBlood />} />
              <Route 
                path="/register-donor" 
                element={
                  <ProtectedRoute>
                    <RegisterDonor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppProvider>
  );
};

export default App;
