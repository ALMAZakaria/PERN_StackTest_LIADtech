const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes for SkillBridge Pro
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'SkillBridge Pro API is running',
    data: {
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Mock SkillBridge Pro endpoints
app.get('/api/v1/freelance/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Freelance profile endpoint working',
    data: {
      id: 'test-freelance-id',
      skills: ['React', 'Node.js', 'TypeScript'],
      dailyRate: 500,
      availability: 40,
      experience: 5
    }
  });
});

app.get('/api/v1/missions', (req, res) => {
  res.json({
    success: true,
    message: 'Missions endpoint working',
    data: [
      {
        id: 'mission-1',
        title: 'React Developer Needed',
        description: 'Looking for a senior React developer',
        budget: 5000,
        duration: 4,
        status: 'OPEN'
      },
      {
        id: 'mission-2',
        title: 'Full Stack Developer',
        description: 'Need a full stack developer for a startup',
        budget: 8000,
        duration: 6,
        status: 'OPEN'
      }
    ]
  });
});

app.get('/api/v1/freelance/search', (req, res) => {
  res.json({
    success: true,
    message: 'Freelancer search endpoint working',
    data: [
      {
        id: 'freelancer-1',
        name: 'John Doe',
        skills: ['React', 'Node.js'],
        dailyRate: 450,
        experience: 3
      },
      {
        id: 'freelancer-2',
        name: 'Jane Smith',
        skills: ['TypeScript', 'Python'],
        dailyRate: 600,
        experience: 7
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillBridge Pro Test Server running on http://localhost:${PORT}`);
  console.log(`📚 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`👨‍💻 Freelance Profile: http://localhost:${PORT}/api/v1/freelance/profile`);
  console.log(`🎯 Missions: http://localhost:${PORT}/api/v1/missions`);
  console.log(`🔍 Search Freelancers: http://localhost:${PORT}/api/v1/freelance/search`);
});

module.exports = app;
