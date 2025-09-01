import { Routes, Route, Navigate } from 'react-router-dom'
import ManagerDashboard from '../components/dashboard/ManagerDashboard'
import UsersPage from '../pages/User/UsersPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import MissionBoardPage from '../pages/missions/MissionBoardPage'
import CreateMissionPage from '../pages/missions/CreateMissionPage'
import SkillBridgeDashboardPage from '../pages/dashboard/SkillBridgeDashboardPage'
import ProfilePage from '../pages/dashboard/ProfilePage'
import SettingsPage from '../pages/dashboard/SettingsPage'
import HomePage from '../pages/HomePage'
import ProtectedRoute from '../components/ProtectedRoute'
import { canAccessUsersManagement } from '../utils/roleUtils'
import Header from '../components/ui/Header'



// Simple Protected Route component for basic auth
const SimpleProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you would check actual authentication state
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Details</h2>
                <p className="text-gray-600">Mission details page coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
        } 
      />
      <Route 
        path="/applications" 
        element={
          <SimpleProtectedRoute>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Applications</h2>
                <p className="text-gray-600">Applications management coming soon...</p>
              </div>
            </div>
          </SimpleProtectedRoute>
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