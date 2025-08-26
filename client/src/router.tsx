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
import UrgenceChien from './pages/articles/UrgenceChien';
import HygieneDentaireChat from './pages/articles/HygieneDentaireChat';
import StressLapin from './pages/articles/StressLapin';
import EducationChiot from './pages/articles/EducationChiot';
import BookAppointmentPage from './pages/clients/BookAppointmentPage';
import HealthAdvicePage from './pages/clients/HealthAdvicePage';
import PrescriptionsPage from './pages/clients/PrescriptionsPage';
import DocumentsPage from './pages/clients/DocumentsPage';
import JoinConsultationPage from './pages/clients/JoinConsultationPage';

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
            <Layout>
              <PatientsPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/consultations"
        element={
          <AuthGuard>
            <Layout>
              <ConsultationsPage />
            </Layout>
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
            <Layout>
              <HealthAdvicePage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <AuthGuard>
            <Layout>
              <PrescriptionsPage />
            </Layout>
          </AuthGuard>
        }
      />
      <Route
        path="/documents"
        element={
          <AuthGuard>
            <Layout>
              <DocumentsPage />
            </Layout>
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
    </Routes>
  );
};
