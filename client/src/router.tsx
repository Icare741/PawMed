import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Importez vos composants de page ici
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import Layout from '@/components/core/Layouts';
import PaymentPage from './pages/Paiments';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Success from '@/components/services/stripe/Success';
import Cancel from '@/components/services/stripe/Cancel';
import LandingPages from './pages/LandingPages';
import VideoChat from './pages/VideoChat';
import AvailabilityPage from './pages/AvailabilityPage';
import PatientsPage from './pages/clients/PatientsPage';
import ConsultationsPage from './pages/ConsultationsPage';
import BookingPage from './pages/BookingPage';
import AppointmentsPage from './pages/clients/AppointmentsPage';
import PractitionerDashboardPage from './pages/practitioners/PractitionerDashboardPage';
import PractitionerConsultationsPage from './pages/practitioners/ConsultationsPage';
import PractitionerPatientsPage from './pages/practitioners/PatientsPage';
import PractitionerPrescriptionsPage from './pages/practitioners/PrescriptionsPage';
import PractitionerDocumentsPage from './pages/practitioners/DocumentsPage';
import RoleGuard from './components/core/guards/RoleGuard';
import PatientGuard from './components/core/guards/PatientGuard';
import UrgenceChien from './pages/articles/UrgenceChien';
import HygieneDentaireChat from './pages/articles/HygieneDentaireChat';
import StressLapin from './pages/articles/StressLapin';
import EducationChiot from './pages/articles/EducationChiot';
import BookAppointmentPage from './pages/clients/BookAppointmentPage';
import HealthAdvicePage from './pages/clients/HealthAdvicePage';
import PrescriptionsPage from './pages/clients/PrescriptionsPage';
import DocumentsPage from './pages/clients/DocumentsPage';
import JoinConsultationPage from './pages/clients/JoinConsultationPage';
import EditPrescriptionPage from './pages/practitioners/EditPrescriptionPage';

const stripePromise = loadStripe(
  'pk_test_51O5unuFEj403Phjgbi9HfcgZSe8NW3jkyu9L47FNAx8dwXknEndmFqYhlmqo2BksV1Uwsv1rfo0s3ZeeZgQYuxSn00P9W9WRNc'
);

// Composant AuthGuard
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to='/landing' />;
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path='/'
        element={
          isAuthenticated ? (
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          ) : (
            <Elements stripe={stripePromise}>
              <LandingPages />
            </Elements>
          )
        }
      />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route
        path='/dashboard'
        element={
          <AuthGuard>
              <DashboardPage />
          </AuthGuard>
        }
      />

      <Route
        path='/book-appointment'
        element={
          <AuthGuard>
            <Layout>
              <BookAppointmentPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path='/profile'
        element={
          <AuthGuard>
              <ProfilePage />
          </AuthGuard>
        }
      />
      <Route
        path='/payment'
        element={
          <AuthGuard>
            <Layout>
              <Elements stripe={stripePromise}>
                <PaymentPage />
              </Elements>
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path='/landing'
        element={
          <Elements stripe={stripePromise}>
            <LandingPages />
          </Elements>
        }
      />
      <Route
        path='/success'
        element={
          <Elements stripe={stripePromise}>
            <Success />
          </Elements>
        }
      />
      <Route
        path='/video-chat/:consultationId'
        element={
          <AuthGuard>
              <VideoChat />
          </AuthGuard>
        }
      />
      <Route
        path="/availabilities"
        element={
          <AuthGuard>
            <Layout>
              <AvailabilityPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/patients"
        element={
          <AuthGuard>
            <PatientGuard>
              <Layout>
                <PatientsPage />
              </Layout>
            </PatientGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/consultations"
        element={
          <AuthGuard>
            <PatientGuard>
              <Layout>
                <ConsultationsPage />
              </Layout>
            </PatientGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/booking"
        element={
          <AuthGuard>
            <Layout>
              <BookingPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/appointments"
        element={
          <AuthGuard>
            <Layout>
              <AppointmentsPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route path="/articles/urgence-chien" element={<UrgenceChien />} />
      <Route path="/articles/hygiene-dentaire-chat" element={<HygieneDentaireChat />} />
      <Route path="/articles/stress-lapin" element={<StressLapin />} />
      <Route path="/articles/education-chiot" element={<EducationChiot />} />
      <Route
        path="/health-advice"
        element={
          <AuthGuard>
            <PatientGuard>
              <Layout>
                <HealthAdvicePage />
              </Layout>
            </PatientGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <AuthGuard>
            <PatientGuard>
              <Layout>
                <PrescriptionsPage />
              </Layout>
            </PatientGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/documents"
        element={
          <AuthGuard>
            <PatientGuard>
              <Layout>
                <DocumentsPage />
              </Layout>
            </PatientGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/join-consultation"
        element={
          <AuthGuard>
            <Layout>
              <JoinConsultationPage />
            </Layout>
          </AuthGuard>
        }
      />
      
      {/* Routes pour les praticiens */}
      <Route
        path="/practitioner/dashboard"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <PractitionerDashboardPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/practitioner/consultations"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <PractitionerConsultationsPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/practitioner/patients"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <PractitionerPatientsPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/practitioner/prescriptions"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <PractitionerPrescriptionsPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/practitioner/prescriptions/:id/edit"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <EditPrescriptionPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
      <Route
        path="/practitioner/documents"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[2]}>
              <PractitionerDocumentsPage />
            </RoleGuard>
          </AuthGuard>
        }
      />
    </Routes>
  );
};
