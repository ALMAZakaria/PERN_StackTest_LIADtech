# Mission Pages

This directory contains the mission-related pages for the SkillBridge application.

## Pages

### MissionBoardPage.tsx
- **Purpose**: Displays a list of all available missions with filtering capabilities
- **Features**:
  - Search missions by title/description
  - Filter by status, skills, budget range, location, and remote work
  - Grid layout with mission cards
  - "View Details" link for each mission
  - "Post Mission" button for companies
- **Route**: `/missions`

### MissionDetailsPage.tsx
- **Purpose**: Displays detailed information about a specific mission
- **Features**:
  - Comprehensive mission information display
  - Company information sidebar
  - Application functionality for freelancers
  - Application management for company owners
  - Status and urgency indicators
  - Breadcrumb navigation
  - Responsive design with mobile-friendly layout
- **Route**: `/missions/:id`

### CreateMissionPage.tsx
- **Purpose**: Allows companies to create new missions
- **Features**:
  - Form for mission creation
  - Skill selection
  - Budget and duration settings
  - Location and remote work options
  - Status and urgency selection
- **Route**: `/missions/create`

## Key Features

### For Freelancers
- View mission details
- Apply for missions with proposal, rate, and duration
- Track application status
- Withdraw applications (if pending)

### For Companies
- View mission details
- Manage applications (accept/reject)
- Edit mission details
- Delete missions
- View company information

### Common Features
- Responsive design
- Loading states
- Error handling
- Success notifications
- Breadcrumb navigation

## API Integration

The pages integrate with the following API endpoints:
- `GET /missions` - List all missions
- `GET /missions/:id` - Get specific mission
- `POST /missions` - Create new mission
- `PUT /missions/:id` - Update mission
- `DELETE /missions/:id` - Delete mission
- `GET /applications/user/my-applications` - Get user's applications
- `POST /applications` - Create application
- `GET /applications/mission/:id` - Get mission applications

## Styling

All pages use Tailwind CSS for styling with:
- Consistent color scheme (indigo primary)
- Responsive grid layouts
- Card-based design
- Status badges with appropriate colors
- Hover effects and transitions
- Mobile-first approach

## State Management

The pages use React hooks for local state management:
- `useState` for form data and UI state
- `useEffect` for data fetching
- `useParams` for route parameters
- `useNavigate` for navigation
- Redux store for user authentication state
