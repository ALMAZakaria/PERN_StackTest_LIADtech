// src/App.tsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './state/store'
import AppRouter from './router/router'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { useAuthCheck } from './hooks/useAuthCheck'

function App() {
  const { isLoading } = useAuthCheck()
  const authState = useSelector((state: RootState) => state.auth)

  if (isLoading || authState.isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <AppRouter />
          </React.Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
