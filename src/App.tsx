import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { TicketProvider } from './context/TicketContext';

import { AppLayout } from './components/layout/AppLayout';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { TerminalDepartmentsPage } from './pages/TerminalDepartmentsPage';
import { DepartmentTicketsPage } from './pages/DepartmentTicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AssignedTicketsPage } from './pages/AssignedTicketsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

// Public Route Guard (prevents logged in user from being trapped on login page)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Pages */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* Authenticated Layout and Pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/terminals/:terminalId" element={<TerminalDepartmentsPage />} />
        <Route
          path="/terminals/:terminalId/departments/:dept"
          element={<DepartmentTicketsPage />}
        />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/assigned-tickets" element={<AssignedTicketsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <TicketProvider>
            <AppRoutes />
          </TicketProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
