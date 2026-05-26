import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './globals.css'; 

// Layouts
import CitizenLayout from './layouts/CitizenLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Citizen Pages
import HomePage from './pages/citizen/HomePage';
import ReportEmergencyPage from './pages/citizen/ReportEmergencyPage';
// Missing files commented out for now:
import NearbyServicesPage from './pages/citizen/NearbyServicesPage';
import TrackIncidentPage from './pages/citizen/TrackIncidentPage';
import EmergencyTipsPage from './pages/citizen/EmergencyTipsPage';

// Dashboard Pages
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import IncidentsPage from './pages/dashboard/IncidentsPage';
// Missing files commented out for now:
// import TeamsPage from './pages/dashboard/TeamsPage';
// import ResourcesPage from './pages/dashboard/ResourcesPage';
// import NotificationsPage from './pages/dashboard/NotificationsPage';
// import AnalyticsPage from './pages/dashboard/AnalyticsPage';

// Auth Pages
import LoginPage from './LoginPage'; 
// Commented out since it's missing from your root src folder:
// import UnauthorizedPage from './UnauthorizedPage'; 

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: 'var(--active)', secondary: 'var(--bg-card)' } },
          error: { iconTheme: { primary: 'var(--critical)', secondary: 'var(--bg-card)' } },
          duration: 4000,
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          {/* <Route path="unauthorized" element={<UnauthorizedPage />} /> */}
        </Route>

        {/* Citizen Routes */}
        <Route path="/" element={<CitizenLayout />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportEmergencyPage />} />
          <Route path="services" element={<NearbyServicesPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          {/* <Route path="teams" element={<TeamsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} /> 
          */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}