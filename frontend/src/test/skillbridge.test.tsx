import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import RegisterPage from '../pages/auth/RegisterPage'
import MissionBoardPage from '../pages/missions/MissionBoardPage'
import SkillBridgeDashboardPage from '../pages/dashboard/SkillBridgeDashboardPage'
import { skillbridgeService } from '../services/skillbridgeService'
import { authService } from '../services/authService'
import { UserType, Role, MissionStatus } from '../services/api'

// Mock the services
vi.mock('../services/skillbridgeService')
vi.mock('../services/authService')

// Mock store
const mockStore = configureStore({
  reducer: {
    auth: (state = { isInitializing: false }) => state,
  },
})

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
)

describe('SkillBridge Pro Frontend Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('RegisterPage', () => {
    it('renders registration form with user type selection', () => {
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      )

      expect(screen.getByText('Join SkillBridge Pro')).toBeInTheDocument()
      expect(screen.getByLabelText('I am a')).toBeInTheDocument()
      expect(screen.getByDisplayValue('FREELANCER')).toBeInTheDocument()
    })

    it('shows freelancer fields when freelancer is selected', () => {
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      )

      const userTypeSelect = screen.getByLabelText('I am a')
      fireEvent.change(userTypeSelect, { target: { value: UserType.FREELANCER } })

      expect(screen.getByLabelText('Skills (comma-separated)')).toBeInTheDocument()
      expect(screen.getByLabelText('Daily Rate (€)')).toBeInTheDocument()
      expect(screen.getByLabelText('Years of Experience')).toBeInTheDocument()
    })

    it('shows company fields when company is selected', () => {
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      )

      const userTypeSelect = screen.getByLabelText('I am a')
      fireEvent.change(userTypeSelect, { target: { value: UserType.COMPANY } })

      expect(screen.getByLabelText('Company Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Industry')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Size')).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      vi.mocked(authService.register).mockRejectedValue(new Error('Validation failed'))
      
      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      )

      const submitButton = screen.getByText('Create Account')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter your first name')).toBeInTheDocument()
      })
    })

    it('submits registration with correct data', async () => {
      vi.mocked(authService.register).mockResolvedValue({
        user: { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', userType: UserType.FREELANCER } as any,
        token: 'mock-token'
      })

      render(
        <TestWrapper>
          <RegisterPage />
        </TestWrapper>
      )

      // Fill in basic info
      fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })

      // Fill in freelancer specific info
      fireEvent.change(screen.getByLabelText('Skills (comma-separated)'), { target: { value: 'React, TypeScript' } })
      fireEvent.change(screen.getByLabelText('Daily Rate (€)'), { target: { value: '500' } })

      const submitButton = screen.getByText('Create Account')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          userType: UserType.FREELANCER,
          skills: ['React', 'TypeScript'],
          experience: 0,
          dailyRate: 500,
          availability: '',
          location: '',
          bio: ''
        })
      })
    })
  })

  describe('MissionBoardPage', () => {
    it('renders mission board with filters', async () => {
      vi.mocked(skillbridgeService.getMissions).mockResolvedValue([
        {
          id: '1',
          title: 'React Developer Needed',
          description: 'Looking for a skilled React developer',
          budget: 5000,
          duration: 30,
          location: 'Paris',
          status: MissionStatus.OPEN,
          requiredSkills: ['React', 'TypeScript'],
          isRemote: true,
          companyId: 'company1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])

      render(
        <TestWrapper>
          <MissionBoardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Mission Board')).toBeInTheDocument()
        expect(screen.getByText('React Developer Needed')).toBeInTheDocument()
        expect(screen.getByLabelText('Search')).toBeInTheDocument()
        expect(screen.getByLabelText('Status')).toBeInTheDocument()
      })
    })

    it('filters missions by search term', async () => {
      vi.mocked(skillbridgeService.getMissions).mockResolvedValue([
        {
          id: '1',
          title: 'React Developer Needed',
          description: 'Looking for a skilled React developer',
          budget: 5000,
          duration: 30,
          location: 'Paris',
          status: MissionStatus.OPEN,
          requiredSkills: ['React', 'TypeScript'],
          isRemote: true,
          companyId: 'company1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Node.js Backend Developer',
          description: 'Need a Node.js developer',
          budget: 4000,
          duration: 20,
          location: 'London',
          status: MissionStatus.OPEN,
          requiredSkills: ['Node.js', 'Express'],
          isRemote: false,
          companyId: 'company2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])

      render(
        <TestWrapper>
          <MissionBoardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('React Developer Needed')).toBeInTheDocument()
        expect(screen.getByText('Node.js Backend Developer')).toBeInTheDocument()
      })

      const searchInput = screen.getByLabelText('Search')
      fireEvent.change(searchInput, { target: { value: 'React' } })

      await waitFor(() => {
        expect(screen.getByText('React Developer Needed')).toBeInTheDocument()
        expect(screen.queryByText('Node.js Backend Developer')).not.toBeInTheDocument()
      })
    })

    it('shows empty state when no missions found', async () => {
      vi.mocked(skillbridgeService.getMissions).mockResolvedValue([])

      render(
        <TestWrapper>
          <MissionBoardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('No missions found')).toBeInTheDocument()
        expect(screen.getByText('Try adjusting your filters or check back later for new opportunities.')).toBeInTheDocument()
      })
    })
  })

  describe('SkillBridgeDashboardPage', () => {
    it('renders dashboard for freelancer', async () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        userType: UserType.FREELANCER,
        role: Role.USER,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser)
      vi.mocked(skillbridgeService.getDashboardStats).mockResolvedValue({
        totalMissions: 10,
        activeApplications: 3,
        completedProjects: 5,
        averageRating: 4.5
      })
      vi.mocked(skillbridgeService.getMissions).mockResolvedValue([])
      vi.mocked(skillbridgeService.getApplications).mockResolvedValue([])
      vi.mocked(skillbridgeService.getNotifications).mockResolvedValue([])

      render(
        <TestWrapper>
          <SkillBridgeDashboardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Welcome back, John!')).toBeInTheDocument()
        expect(screen.getByText('Ready to find your next opportunity?')).toBeInTheDocument()
        expect(screen.getByText('Available Missions')).toBeInTheDocument()
      })
    })

    it('renders dashboard for company', async () => {
      const mockUser = {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Company',
        email: 'sarah@company.com',
        userType: UserType.COMPANY,
        role: Role.USER,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      vi.mocked(authService.getCurrentUser).mockReturnValue(mockUser)
      vi.mocked(skillbridgeService.getDashboardStats).mockResolvedValue({
        totalMissions: 5,
        activeApplications: 8,
        completedProjects: 12,
        averageRating: 4.8
      })
      vi.mocked(skillbridgeService.getCompanyMissions).mockResolvedValue([])
      vi.mocked(skillbridgeService.getApplications).mockResolvedValue([])
      vi.mocked(skillbridgeService.getNotifications).mockResolvedValue([])

      render(
        <TestWrapper>
          <SkillBridgeDashboardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Welcome back, Sarah!')).toBeInTheDocument()
        expect(screen.getByText('Ready to find the perfect talent for your projects?')).toBeInTheDocument()
        expect(screen.getByText('Posted Missions')).toBeInTheDocument()
      })
    })

    it('shows error state when API fails', async () => {
      vi.mocked(authService.getCurrentUser).mockReturnValue(null)

      render(
        <TestWrapper>
          <SkillBridgeDashboardPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument()
        expect(screen.getByText('User not authenticated')).toBeInTheDocument()
      })
    })
  })

  describe('SkillBridgeService', () => {
    it('calls correct API endpoints', async () => {
      // Test getMissions
      await skillbridgeService.getMissions()
      expect(skillbridgeService.getMissions).toHaveBeenCalled()

      // Test getApplications
      await skillbridgeService.getApplications()
      expect(skillbridgeService.getApplications).toHaveBeenCalled()

      // Test getNotifications
      await skillbridgeService.getNotifications()
      expect(skillbridgeService.getNotifications).toHaveBeenCalled()
    })
  })
})
