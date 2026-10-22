import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ShellLayout } from './layouts/ShellLayout';
import { LoginScreen } from './pages/LoginScreen';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { InfrastructureDashboard } from './pages/InfrastructureDashboard';
import { NocDashboard } from './pages/NocDashboard';
import { ApplicationDashboard } from './pages/ApplicationDashboard';
import { MonitoringModule } from './pages/MonitoringModule';
import { AlertManagement } from './pages/AlertManagement';
import { IncidentManagement } from './pages/IncidentManagement';
import { ReportingModule } from './pages/ReportingModule';
import { AdminConsole } from './pages/AdminConsole';

import { authService, UserProfile } from './services/authService';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const isAuthenticated = !!currentUser && authService.isAuthenticated();

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ShellLayout currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/executive" replace />} />
            <Route path="/dashboard/executive" element={<ExecutiveDashboard />} />
            <Route path="/dashboard/infrastructure" element={<InfrastructureDashboard />} />
            <Route path="/dashboard/noc" element={<NocDashboard />} />
            <Route path="/dashboard/applications" element={<ApplicationDashboard />} />
            <Route path="/monitoring" element={<MonitoringModule />} />
            <Route path="/alerts" element={<AlertManagement />} />
            <Route path="/incidents" element={<IncidentManagement />} />
            <Route path="/reports" element={<ReportingModule />} />
            <Route path="/admin" element={<AdminConsole currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/dashboard/executive" replace />} />
          </Routes>
        </ShellLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
