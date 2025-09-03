import { Routes, Route, Navigate } from 'react-router-dom'
import ManagerDashboard from '../components/dashboard/ManagerDashboard'
import UsersPage from '../pages/User/UsersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MissionBoardPage from '../pages/missions/MissionBoardPage'
import CreateMissionPage from '../pages/missions/CreateMissionPage'
import MissionDetailsPage from '../pages/missions/MissionDetailsPage'
import SkillBridgeDashboardPage from '../pages/dashboard/SkillBridgeDashboardPage'
import ProfilePage from '../pages/dashboard/ProfilePage'
import SettingsPage from '../pages/dashboard/SettingsPage'
import HomePage from '../pages/HomePage'
import ProtectedRoute from '../components/ProtectedRoute'
import { canAccessUsersManagement } from '../utils/roleUtils'
import Header from '../components/ui/Header'

// Import new application pages
import ApplicationsPage from '../pages/applications/ApplicationsPage'
import CompanyApplicationsPage from '../pages/applications/CompanyApplicationsPage'
import ApplicationDetailsPage from '../pages/applications/ApplicationDetailsPage'

// Simple Protected Route component for basic auth
const SimpleProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you would check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Role-based route component for applications
const ApplicationsRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Check if user has a profile (freelancer or company)
  if (!user.userType || (user.userType !== 'FREELANCER' && user.userType !== 'COMPANY')) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Main App Router
const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <>
          <Header />
          <HomePage />
        </>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/missions" element={<MissionBoardPage />} />
      
      {/* Manager Dashboard routes - for admin and moderator user management */}
      <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
      <Route path="/ManagerDashboard/users" element={<UsersPage />} />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <SimpleProtectedRoute>
            <SkillBridgeDashboardPage />
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/profile" 
        element={
          <SimpleProtectedRoute>
            <ProfilePage />
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/settings" 
        element={
          <SimpleProtectedRoute>
            <SettingsPage />
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/users" 
        element={
          <ProtectedRoute requiredPermission={canAccessUsersManagement}>
            <UsersPage />
          </ProtectedRoute>
        } 
      />
      
      {/* SkillBridge Pro specific routes */}
      <Route 
        path="/missions/create" 
        element={
          <SimpleProtectedRoute>
            <CreateMissionPage />
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/missions/:id" 
        element={
          <SimpleProtectedRoute>
            <MissionDetailsPage />
          </SimpleProtectedRoute>
        } 
      />
      
      {/* Application Management Routes */}
      <Route 
        path="/applications" 
        element={
          <ApplicationsRoute>
            <ApplicationsPage />
          </ApplicationsRoute>
        } 
      />
      <Route 
        path="/applications/company" 
        element={
          <ApplicationsRoute>
            <CompanyApplicationsPage />
          </ApplicationsRoute>
        } 
      />
      <Route 
        path="/applications/:id" 
        element={
          <ApplicationsRoute>
            <ApplicationDetailsPage />
          </ApplicationsRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <SimpleProtectedRoute>
            <ProfilePage />
          </SimpleProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter 