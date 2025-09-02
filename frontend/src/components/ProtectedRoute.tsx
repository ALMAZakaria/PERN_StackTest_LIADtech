import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/hooks'
import { getRedirectPathByRole } from '../utils/roleUtils'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermission?: (userRole: string) => boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredPermission 
}) => {
  const { isAuthenticated, user, isInitializing } = useAppSelector(state => state.auth)
  const location = useLocation()

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based permissions
  if (requiredRole && user.role.toUpperCase() !== requiredRole.toUpperCase()) {
    const redirectPath = getRedirectPathByRole(user.role)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have the required role to access this page.</p>
          <Navigate to={redirectPath} replace />
        </div>
      </div>
    )
  }

  // Check custom permission function
  if (requiredPermission && !requiredPermission(user.role)) {
    const redirectPath = getRedirectPathByRole(user.role)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Navigate to={redirectPath} replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
