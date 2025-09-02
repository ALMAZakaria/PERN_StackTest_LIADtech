

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

// Application management role utilities
export const canAccessApplications = (user: any): boolean => {
  return user && (user.userType === 'FREELANCER' || user.userType === 'COMPANY');
};

export const canViewOwnApplications = (user: any): boolean => {
  return user && (user.userType === 'FREELANCER' || user.userType === 'COMPANY');
};

export const canViewCompanyApplications = (user: any): boolean => {
  return user && user.userType === 'COMPANY';
};

export const canUpdateApplicationStatus = (user: any, application: any): boolean => {
  if (!user || !application) return false;
  
  // Company can update status of applications to their missions
  if (user.userType === 'COMPANY') {
    return application.company?.userId === user.id;
  }
  
  // Freelancer can only update their own applications (withdraw)
  if (user.userType === 'FREELANCER') {
    return application.freelancer?.userId === user.id;
  }
  
  return false;
};

export const canWithdrawApplication = (user: any, application: any): boolean => {
  if (!user || !application) return false;
  
  // Only freelancers can withdraw their own applications
  if (user.userType === 'FREELANCER') {
    return application.freelancer?.userId === user.id && application.status === 'PENDING';
  }
  
  return false;
};

export const canAcceptRejectApplication = (user: any, application: any): boolean => {
  if (!user || !application) return false;
  
  // Only companies can accept/reject applications to their missions
  if (user.userType === 'COMPANY') {
    return application.company?.userId === user.id && application.status === 'PENDING';
  }
  
  return false;
};

export const getApplicationPageTitle = (user: any): string => {
  if (!user) return 'Applications';
  
  switch (user.userType) {
    case 'FREELANCER':
      return 'My Applications';
    case 'COMPANY':
      return 'Mission Applications';
    default:
      return 'Applications';
  }
};

export const getApplicationPageDescription = (user: any): string => {
  if (!user) return 'Manage your applications';
  
  switch (user.userType) {
    case 'FREELANCER':
      return 'Track and manage your mission applications';
    case 'COMPANY':
      return 'Review and manage applications for your posted missions';
    default:
      return 'Manage your applications';
  }
};
