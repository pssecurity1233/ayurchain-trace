import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Scanner from "./pages/Scanner";
import Collector from "./pages/Collector";
import Dashboard from "./pages/Dashboard";
import Laboratory from "./pages/Laboratory";
import CollectorDashboard from "./pages/CollectorDashboard";
import LabDashboard from "./pages/LabDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ProcessorDashboard from "./pages/ProcessorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getDashboardRoute = () => {
    if (!user || !userRole) return '/dashboard';
    
    switch (userRole) {
      case 'collector':
        return '/collector-dashboard';
      case 'lab':
        return '/lab-dashboard';
      case 'manufacturer':
        return '/manufacturer-dashboard';
      case 'consumer':
        return '/consumer-dashboard';
      case 'processor':
        return '/processor-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            {user ? <Navigate to={getDashboardRoute()} replace /> : <Home />}
          </ProtectedRoute>
        } />
        
        {/* Role-specific Dashboards */}
        <Route path="/collector-dashboard" element={
          <ProtectedRoute allowedRoles={['collector']}>
            <CollectorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/lab-dashboard" element={
          <ProtectedRoute allowedRoles={['lab_technician']}>
            <LabDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/manufacturer-dashboard" element={
          <ProtectedRoute allowedRoles={['manufacturer']}>
            <ManufacturerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/consumer-dashboard" element={
          <ProtectedRoute allowedRoles={['consumer']}>
            <ConsumerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Legacy Routes */}
        <Route path="/scan" element={
          <ProtectedRoute>
            <Scanner />
          </ProtectedRoute>
        } />
        
        <Route path="/collect" element={
          <ProtectedRoute allowedRoles={['collector']}>
            <Collector />
          </ProtectedRoute>
        } />
        
        <Route path="/lab" element={
          <ProtectedRoute allowedRoles={['lab_technician']}>
            <Laboratory />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
