import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { ArmedPage } from './pages/ArmedPage';
import { ContactsPage } from './pages/ContactsPage';
import { TriggersPage } from './pages/TriggersPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SOSPage } from './pages/SOSPage';
import { LiveLocationPage } from './pages/LiveLocationPage';
import { useAuth } from './hooks/useFirebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          
          <Route path="onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="armed" element={
            <ProtectedRoute>
              <ArmedPage />
            </ProtectedRoute>
          } />
          
          <Route path="contacts" element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          } />
          
          <Route path="triggers" element={
            <ProtectedRoute>
              <TriggersPage />
            </ProtectedRoute>
          } />
          
          <Route path="history" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="sos" element={
            <ProtectedRoute>
              <SOSPage />
            </ProtectedRoute>
          } />
          
          <Route path="location" element={
            <ProtectedRoute>
              <LiveLocationPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
