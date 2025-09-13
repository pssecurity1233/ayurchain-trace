import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireVerification = false 
}) => {
  const { user, userRole, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireVerification && profile?.verification_status !== 'verified') {
    return <Navigate to="/verification-pending" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;