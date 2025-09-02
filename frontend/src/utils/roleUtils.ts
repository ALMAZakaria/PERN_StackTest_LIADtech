import { User } from '../services/api'

export type Role = 'USER' | 'ADMIN' | 'MODERATOR'

export interface RolePermissions {
  canManageUsers: boolean
  canManageAdmins: boolean
  canManageModerators: boolean
  canCreateUsers: boolean
  canDeleteUsers: boolean
  canUpdateUsers: boolean
}

export const getRolePermissions = (userRole: string): RolePermissions => {
  const role = userRole.toUpperCase() as Role
  
  switch (role) {
    case 'ADMIN':
      return {
        canManageUsers: true,
        canManageAdmins: true,
        canManageModerators: true,
        canCreateUsers: true,
        canDeleteUsers: true,
        canUpdateUsers: true,
      }
    case 'MODERATOR':
      return {
        canManageUsers: true,
        canManageAdmins: false,
        canManageModerators: false,
        canCreateUsers: true,
        canDeleteUsers: false,
        canUpdateUsers: true,
      }
    case 'USER':
    default:
      return {
        canManageUsers: false,
        canManageAdmins: false,
        canManageModerators: false,
        canCreateUsers: false,
        canDeleteUsers: false,
        canUpdateUsers: false,
      }
  }
}

export const canAccessUsersManagement = (userRole: string): boolean => {
  const permissions = getRolePermissions(userRole)
  return permissions.canManageUsers
}

export const getAvailableRolesForUser = (currentUserRole: string): Role[] => {
  const role = currentUserRole.toUpperCase() as Role
  
  switch (role) {
    case 'ADMIN':
      return ['USER', 'MODERATOR', 'ADMIN']
    case 'MODERATOR':
      return ['USER']
    default:
      return []
  }
}

export const canManageRole = (currentUserRole: string, targetRole: string): boolean => {
  const currentRole = currentUserRole.toUpperCase() as Role
  const targetRoleUpper = targetRole.toUpperCase() as Role
  
  switch (currentRole) {
    case 'ADMIN':
      return true // Admin can manage all roles
    case 'MODERATOR':
      return targetRoleUpper === 'USER' // Moderator can only manage USER roles
    default:
      return false
  }
}

export const canDeleteUser = (currentUserRole: string, targetUserRole: string): boolean => {
  const currentRole = currentUserRole.toUpperCase() as Role
  const targetRole = targetUserRole.toUpperCase() as Role
  
  // Users cannot delete themselves
  if (currentRole === targetRole) {
    return false
  }
  
  switch (currentRole) {
    case 'ADMIN':
      return true // Admin can delete any user except themselves
    case 'MODERATOR':
      return targetRole === 'USER' // Moderator can only delete USER roles
    default:
      return false
  }
}

// New function for role-based redirection
export const getRedirectPathByRole = (userRole: string): string => {
  const role = userRole.toUpperCase() as Role
  
  switch (role) {
    case 'ADMIN':
    case 'MODERATOR':
      return '/demo'
    case 'USER':
    default:
      return '/dashboard'
  }
}
