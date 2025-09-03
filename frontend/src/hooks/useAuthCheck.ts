import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { setUser, clearAuth, setLoading } from '../state/slices/slice'
import { authService } from '../services/authService'

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()
  const authState = useAppSelector(state => state.auth)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch(setLoading(true))
        
        // Check if user is authenticated using authService
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser()
          const token = authService.getToken()
          
          if (user && token) {
            // Ensure role is in correct case format
            const normalizedUser = {
              ...user,
              role: user.role.toUpperCase() // Normalize to uppercase for consistency
            }
            dispatch(setUser({ user: normalizedUser, token }))
          } else {
            // Clear invalid auth data
            authService.clearAuthData()
            dispatch(clearAuth())
          }
        } else {
          dispatch(clearAuth())
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authService.clearAuthData()
        dispatch(clearAuth())
      } finally {
        dispatch(setLoading(false))
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [dispatch])

  return {
    isLoading,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
  }
} 