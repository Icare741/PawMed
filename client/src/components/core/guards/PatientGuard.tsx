import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

interface PatientGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PatientGuard: React.FC<PatientGuardProps> = ({ 
  children, 
  redirectTo = "/dashboard" 
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // Si pas d'utilisateur connecté, rediriger
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si l'utilisateur est un praticien, rediriger vers son dashboard
  if (user.role_id === 2) {
    return <Navigate to="/practitioner/dashboard" replace />;
  }

  // Si l'utilisateur est un admin, rediriger vers le dashboard principal
  if (user.role_id === 3) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si c'est un patient (role_id === 1), afficher le contenu
  return <>{children}</>;
};

export default PatientGuard;
