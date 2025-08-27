import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: number[];
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/dashboard" 
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // Si pas d'utilisateur connecté, rediriger vers le dashboard
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si l'utilisateur n'a pas le bon rôle, rediriger
  if (!allowedRoles.includes(user.role_id)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si tout est OK, afficher le contenu
  return <>{children}</>;
};

export default RoleGuard;
