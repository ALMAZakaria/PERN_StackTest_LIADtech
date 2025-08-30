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
      experience: 5,
      bio: 'Senior React Developer with 5+ years of experience',
      location: 'Paris, France'
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
        title: 'React Developer Needed for E-commerce Platform',
        description: 'Looking for a senior React developer to help build a modern e-commerce platform. Experience with TypeScript and Next.js required.',
        requiredSkills: ['React', 'TypeScript', 'Next.js'],
        budget: 8000,
        duration: 6,
        status: 'OPEN',
        isRemote: true,
        location: 'Remote'
      },
      {
        id: 'mission-2',
        title: 'Full Stack Developer for FinTech Startup',
        description: 'Need a full stack developer for a FinTech startup. Experience with Node.js, React, and financial APIs required.',
        requiredSkills: ['Node.js', 'React', 'TypeScript'],
        budget: 12000,
        duration: 8,
        status: 'OPEN',
        isRemote: true,
        location: 'Remote'
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
        name: 'Alex Developer',
        skills: ['React', 'Node.js', 'TypeScript'],
        dailyRate: 500,
        experience: 5,
        bio: 'Senior React Developer with 5+ years of experience',
        location: 'Paris, France',
        availability: 40
      },
      {
        id: 'freelancer-2',
        name: 'Sarah Engineer',
        skills: ['TypeScript', 'Python', 'AWS'],
        dailyRate: 600,
        experience: 7,
        bio: 'Full Stack Engineer with expertise in cloud technologies',
        location: 'San Francisco, CA',
        availability: 30
      }
    ]
  });
});

app.get('/api/v1/company/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Company profile endpoint working',
    data: {
      id: 'test-company-id',
      companyName: 'TechStartup Inc',
      industry: 'Technology',
      size: 'STARTUP',
      description: 'Innovative startup building the next big thing',
      website: 'https://techstartup.com',
      location: 'San Francisco, CA'
    }
  });
});

app.get('/api/v1/skills', (req, res) => {
  res.json({
    success: true,
    message: 'Skills endpoint working',
    data: [
      'React', 'Node.js', 'TypeScript', 'Python', 'JavaScript', 'PostgreSQL',
      'AWS', 'Docker', 'MongoDB', 'Express.js', 'Vue.js', 'Angular'
    ]
  });
});

app.get('/api/v1/skills/search', (req, res) => {
  const query = req.query.query || '';
  const skills = ['React', 'Node.js', 'TypeScript', 'Python', 'JavaScript'];
  const filtered = skills.filter(skill => 
    skill.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    success: true,
    message: 'Skills search working',
    data: filtered
  });
});

app.get('/api/v1/portfolio/user/my-portfolio', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio endpoint working',
    data: [
      {
        id: 'project-1',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce platform built with React and Node.js',
        technologies: ['React', 'Node.js', 'PostgreSQL'],
        imageUrl: 'https://example.com/project1.jpg',
        projectUrl: 'https://project1.com'
      },
      {
        id: 'project-2',
        title: 'Task Management App',
        description: 'Collaborative task management application',
        technologies: ['Vue.js', 'Express.js', 'MongoDB'],
        imageUrl: 'https://example.com/project2.jpg',
        projectUrl: 'https://project2.com'
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillBridge Pro Test Server running on http://localhost:${PORT}`);
  console.log(`📚 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`👨‍💻 Freelance Profile: http://localhost:${PORT}/api/v1/freelance/profile`);
  console.log(`🏢 Company Profile: http://localhost:${PORT}/api/v1/company/profile`);
  console.log(`🎯 Missions: http://localhost:${PORT}/api/v1/missions`);
  console.log(`🔍 Search Freelancers: http://localhost:${PORT}/api/v1/freelance/search`);
  console.log(`💼 Skills: http://localhost:${PORT}/api/v1/skills`);
  console.log(`🔍 Skills Search: http://localhost:${PORT}/api/v1/skills/search`);
  console.log(`📁 Portfolio: http://localhost:${PORT}/api/v1/portfolio/user/my-portfolio`);
});

module.exports = app;
