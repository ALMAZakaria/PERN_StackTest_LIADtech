-- SkillBridge Database Seed File
-- This file contains all the INSERT statements to populate the database
-- Execute this file in your PostgreSQL database

-- =====================================================
-- 1. INSERT USERS
-- =====================================================
INSERT INTO users (email, password, "firstName", "lastName", role, "userType", "isActive", "createdAt", "updatedAt") VALUES
('john.doe@email.com', '$2b$10$hashedpassword123', 'John', 'Doe', 'USER', 'FREELANCER', true, NOW(), NOW()),
('jane.smith@email.com', '$2b$10$hashedpassword456', 'Jane', 'Smith', 'USER', 'FREELANCER', true, NOW(), NOW()),
('mike.johnson@email.com', '$2b$10$hashedpassword789', 'Mike', 'Johnson', 'USER', 'FREELANCER', true, NOW(), NOW()),
('techcorp@company.com', '$2b$10$hashedpassword101', 'Tech', 'Corp', 'USER', 'COMPANY', true, NOW(), NOW()),
('innovate@startup.com', '$2b$10$hashedpassword202', 'Innovate', 'Startup', 'USER', 'COMPANY', true, NOW(), NOW()),
('admin@skillbridge.com', '$2b$10$hashedpassword303', 'Admin', 'User', 'ADMIN', 'FREELANCER', true, NOW(), NOW());

-- =====================================================
-- 2. INSERT FREELANCE PROFILES
-- =====================================================
INSERT INTO freelance_profiles ("userId", skills, "dailyRate", availability, bio, location, experience, "isVerified", "createdAt", "updatedAt") VALUES
((SELECT id FROM users WHERE email = 'john.doe@email.com'), ARRAY['React', 'TypeScript', 'Node.js'], 150.00, 5, 'Full-stack developer with 3 years of experience', 'New York, NY', 3, true, NOW(), NOW()),
((SELECT id FROM users WHERE email = 'jane.smith@email.com'), ARRAY['Python', 'Django', 'PostgreSQL'], 120.00, 4, 'Backend developer specializing in Python', 'San Francisco, CA', 2, false, NOW(), NOW()),
((SELECT id FROM users WHERE email = 'mike.johnson@email.com'), ARRAY['UI/UX Design', 'Figma', 'Adobe Creative Suite'], 180.00, 3, 'Creative designer with passion for user experience', 'Los Angeles, CA', 4, true, NOW(), NOW());

-- =====================================================
-- 3. INSERT COMPANY PROFILES
-- =====================================================
INSERT INTO company_profiles ("userId", "companyName", industry, size, description, website, location, "isVerified", "createdAt", "updatedAt") VALUES
((SELECT id FROM users WHERE email = 'techcorp@company.com'), 'TechCorp Solutions', 'Technology', 'MEDIUM', 'Leading software development company', 'https://techcorp.com', 'Austin, TX', true, NOW(), NOW()),
((SELECT id FROM users WHERE email = 'innovate@startup.com'), 'InnovateStartup', 'Startup', 'STARTUP', 'Innovative startup disrupting the market', 'https://innovatestartup.com', 'Seattle, WA', false, NOW(), NOW());

-- =====================================================
-- 4. INSERT MISSIONS
-- =====================================================
INSERT INTO missions (title, description, "requiredSkills", budget, duration, location, "isRemote", status, urgency, "companyId", "createdAt", "updatedAt") VALUES
('React Frontend Developer Needed', 'Looking for an experienced React developer to build a modern web application', ARRAY['React', 'TypeScript', 'CSS'], 5000.00, 30, 'Remote', true, 'OPEN', 'HIGH', (SELECT id FROM company_profiles WHERE "companyName" = 'TechCorp Solutions'), NOW(), NOW()),
('Python Backend API Development', 'Need a Python developer to create RESTful APIs for our platform', ARRAY['Python', 'Django', 'PostgreSQL'], 8000.00, 45, 'Remote', true, 'OPEN', 'NORMAL', (SELECT id FROM company_profiles WHERE "companyName" = 'TechCorp Solutions'), NOW(), NOW()),
('UI/UX Design for Mobile App', 'Seeking a talented designer to create beautiful mobile app interfaces', ARRAY['UI/UX Design', 'Figma', 'Mobile Design'], 6000.00, 25, 'Remote', true, 'OPEN', 'URGENT', (SELECT id FROM company_profiles WHERE "companyName" = 'InnovateStartup'), NOW(), NOW()),
('Full-Stack Web Application', 'Complete web application development from frontend to backend', ARRAY['React', 'Node.js', 'MongoDB'], 12000.00, 60, 'Remote', true, 'IN_PROGRESS', 'NORMAL', (SELECT id FROM company_profiles WHERE "companyName" = 'InnovateStartup'), NOW(), NOW());

-- =====================================================
-- 5. INSERT APPLICATIONS
-- =====================================================
INSERT INTO applications ("missionId", "freelancerId", "companyId", proposal, "proposedRate", "estimatedDuration", status, "createdAt", "updatedAt") VALUES
((SELECT id FROM missions WHERE title = 'React Frontend Developer Needed'), (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com')), (SELECT id FROM company_profiles WHERE "companyName" = 'TechCorp Solutions'), 'I have extensive experience with React and TypeScript. I can deliver a high-quality frontend application.', 140.00, 25, 'PENDING', NOW(), NOW()),
((SELECT id FROM missions WHERE title = 'Python Backend API Development'), (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'jane.smith@email.com')), (SELECT id FROM company_profiles WHERE "companyName" = 'TechCorp Solutions'), 'I specialize in Python backend development and can create robust APIs for your platform.', 110.00, 40, 'ACCEPTED', NOW(), NOW()),
((SELECT id FROM missions WHERE title = 'UI/UX Design for Mobile App'), (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'mike.johnson@email.com')), (SELECT id FROM company_profiles WHERE "companyName" = 'InnovateStartup'), 'I have a strong portfolio in mobile app design and can create stunning interfaces.', 170.00, 20, 'PENDING', NOW(), NOW()),
((SELECT id FROM missions WHERE title = 'Full-Stack Web Application'), (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com')), (SELECT id FROM company_profiles WHERE "companyName" = 'InnovateStartup'), 'I can handle both frontend and backend development for your complete web application.', 160.00, 55, 'IN_PROGRESS', NOW(), NOW());

-- =====================================================
-- 6. INSERT PORTFOLIO PROJECTS
-- =====================================================
INSERT INTO portfolio_projects (title, description, technologies, "imageUrl", "projectUrl", "githubUrl", "freelancerId", "createdAt", "updatedAt") VALUES
('E-Commerce Platform', 'A full-stack e-commerce platform built with React and Node.js', ARRAY['React', 'Node.js', 'MongoDB'], 'https://example.com/image1.jpg', 'https://ecommerce-demo.com', 'https://github.com/johndoe/ecommerce', (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com')), NOW(), NOW()),
('Task Management App', 'A collaborative task management application with real-time updates', ARRAY['React', 'Socket.io', 'Express'], 'https://example.com/image2.jpg', 'https://taskapp-demo.com', 'https://github.com/johndoe/taskapp', (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com')), NOW(), NOW()),
('RESTful API Service', 'A comprehensive REST API for a social media platform', ARRAY['Python', 'Django', 'PostgreSQL'], 'https://example.com/image3.jpg', 'https://api-docs.com', 'https://github.com/janesmith/api-service', (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'jane.smith@email.com')), NOW(), NOW()),
('Mobile App Design', 'Complete UI/UX design for a fitness tracking mobile application', ARRAY['Figma', 'Adobe XD', 'Sketch'], 'https://example.com/image4.jpg', 'https://dribbble.com/portfolio', NULL, (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'mike.johnson@email.com')), NOW(), NOW());

-- =====================================================
-- 7. INSERT RATINGS
-- =====================================================
INSERT INTO ratings ("fromUserId", "toUserId", "applicationId", rating, comment, "createdAt") VALUES
((SELECT id FROM users WHERE email = 'techcorp@company.com'), (SELECT id FROM users WHERE email = 'jane.smith@email.com'), (SELECT id FROM applications WHERE "missionId" = (SELECT id FROM missions WHERE title = 'Python Backend API Development') AND "freelancerId" = (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'jane.smith@email.com'))), 5, 'Excellent work! Very professional and delivered on time.', NOW()),
((SELECT id FROM users WHERE email = 'jane.smith@email.com'), (SELECT id FROM users WHERE email = 'techcorp@company.com'), (SELECT id FROM applications WHERE "missionId" = (SELECT id FROM missions WHERE title = 'Python Backend API Development') AND "freelancerId" = (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'jane.smith@email.com'))), 5, 'Great client to work with. Clear requirements and timely payments.', NOW()),
((SELECT id FROM users WHERE email = 'innovate@startup.com'), (SELECT id FROM users WHERE email = 'john.doe@email.com'), (SELECT id FROM applications WHERE "missionId" = (SELECT id FROM missions WHERE title = 'Full-Stack Web Application') AND "freelancerId" = (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com'))), 4, 'Good communication and quality work. Would recommend!', NOW()),
((SELECT id FROM users WHERE email = 'john.doe@email.com'), (SELECT id FROM users WHERE email = 'innovate@startup.com'), (SELECT id FROM applications WHERE "missionId" = (SELECT id FROM missions WHERE title = 'Full-Stack Web Application') AND "freelancerId" = (SELECT id FROM freelance_profiles WHERE "userId" = (SELECT id FROM users WHERE email = 'john.doe@email.com'))), 4, 'Fair client with reasonable expectations.', NOW());

-- =====================================================
-- VERIFICATION QUERIES (Optional - run these to verify the data)
-- =====================================================

-- Check total counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Freelance Profiles', COUNT(*) FROM freelance_profiles
UNION ALL
SELECT 'Company Profiles', COUNT(*) FROM company_profiles
UNION ALL
SELECT 'Missions', COUNT(*) FROM missions
UNION ALL
SELECT 'Applications', COUNT(*) FROM applications
UNION ALL
SELECT 'Portfolio Projects', COUNT(*) FROM portfolio_projects
UNION ALL
SELECT 'Ratings', COUNT(*) FROM ratings;

-- Check some sample data
SELECT 'Sample Users:' as info;
SELECT email, "firstName", "lastName", "userType" FROM users LIMIT 5;

SELECT 'Sample Missions:' as info;
SELECT title, budget, status FROM missions LIMIT 5;

SELECT 'Sample Applications:' as info;
SELECT a.id, m.title, u.email as freelancer_email, a.status 
FROM applications a 
JOIN freelance_profiles fp ON a."freelancerId" = fp.id 
JOIN users u ON fp."userId" = u.id 
JOIN missions m ON a."missionId" = m.id 
LIMIT 5;
