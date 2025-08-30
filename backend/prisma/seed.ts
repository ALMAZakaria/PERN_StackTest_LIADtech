import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillBridge Pro database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });

  console.log('👥 Created users:', { adminUser, regularUser });

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'laptop-001' },
      update: {},
      create: {
        id: 'laptop-001',
        name: 'MacBook Pro 16"',
        description: 'High-performance laptop for professionals',
        price: 2499.99,
        stock: 10,
        category: 'Electronics',
        imageUrl: 'https://example.com/macbook.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'phone-001' },
      update: {},
      create: {
        id: 'phone-001',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced features',
        price: 999.99,
        stock: 25,
        category: 'Electronics',
        imageUrl: 'https://example.com/iphone.jpg',
      },
    }),
    prisma.product.upsert({
      where: { id: 'headphones-001' },
      update: {},
      create: {
        id: 'headphones-001',
        name: 'AirPods Pro',
        description: 'Wireless noise-canceling headphones',
        price: 249.99,
        stock: 50,
        category: 'Electronics',
        imageUrl: 'https://example.com/airpods.jpg',
      },
    }),
  ]);

  console.log('📦 Created products:', products);

  // Create sample order
  const order = await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: 'PENDING',
      totalAmount: 1249.98,
      orderItems: {
        create: [
          {
            productId: products[1].id, // iPhone
            quantity: 1,
            price: 999.99,
          },
          {
            productId: products[2].id, // AirPods
            quantity: 1,
            price: 249.99,
          },
        ],
      },
    },
    include: {
      orderItems: true,
    },
  });

  console.log('🛒 Created order:', order);

  // SkillBridge Pro Sample Data
  console.log('🚀 Creating SkillBridge Pro sample data...');

  // Create freelancer users
  const freelancer1 = await prisma.user.upsert({
    where: { email: 'alex.developer@skillbridge.com' },
    update: {},
    create: {
      email: 'alex.developer@skillbridge.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Johnson',
      role: 'FREELANCER',
    },
  });

  const freelancer2 = await prisma.user.upsert({
    where: { email: 'sarah.designer@skillbridge.com' },
    update: {},
    create: {
      email: 'sarah.designer@skillbridge.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'FREELANCER',
    },
  });

  // Create company users
  const company1 = await prisma.user.upsert({
    where: { email: 'cto@techstartup.com' },
    update: {},
    create: {
      email: 'cto@techstartup.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Brown',
      role: 'COMPANY',
    },
  });

  const company2 = await prisma.user.upsert({
    where: { email: 'hr@fintech.com' },
    update: {},
    create: {
      email: 'hr@fintech.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Davis',
      role: 'COMPANY',
    },
  });

  console.log('👥 Created SkillBridge users:', { freelancer1, freelancer2, company1, company2 });

  // Create freelance profiles
  const alexProfile = await prisma.freelanceProfile.upsert({
    where: { userId: freelancer1.id },
    update: {},
    create: {
      userId: freelancer1.id,
      bio: 'Senior React Developer with 5+ years of experience building scalable web applications. Specialized in modern React, TypeScript, and Node.js.',
      skills: '["React", "TypeScript", "Node.js", "Next.js", "MongoDB", "PostgreSQL", "AWS"]',
      dailyRate: 500.00,
      availability: 40, // 40 hours per week
      location: 'Paris, France (Remote)',
      experience: 5,
    },
  });

  const sarahProfile = await prisma.freelanceProfile.upsert({
    where: { userId: freelancer2.id },
    update: {},
    create: {
      userId: freelancer2.id,
      bio: 'Creative UI/UX Designer and Frontend Developer. Expert in creating beautiful, user-centered digital experiences.',
      skills: '["UI/UX Design", "Figma", "React", "Vue.js", "Tailwind CSS", "JavaScript", "Responsive Design"]',
      dailyRate: 400.00,
      availability: 30, // 30 hours per week
      location: 'Lyon, France (Hybrid)',
      experience: 4,
    },
  });

  console.log('💼 Created freelance profiles:', { alexProfile, sarahProfile });

  // Create portfolio projects for Alex
  const alexPortfolio = await Promise.all([
    prisma.portfolioProject.create({
      data: {
        freelanceProfileId: alexProfile.id,
        title: 'E-commerce Platform Redesign',
        description: 'Complete redesign and development of a modern e-commerce platform using React and Node.js. Implemented payment integration, inventory management, and admin dashboard.',
        technologies: '["React", "Node.js", "MongoDB", "Stripe", "AWS"]',
        projectUrl: 'https://demo-ecommerce.alexjohnson.dev',
        githubUrl: 'https://github.com/alexjohnson/ecommerce-platform',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-09-15'),
      },
    }),
    prisma.portfolioProject.create({
      data: {
        freelanceProfileId: alexProfile.id,
        title: 'Real-time Analytics Dashboard',
        description: 'Built a real-time analytics dashboard for a SaaS company. Features include live data visualization, custom reports, and user management.',
        technologies: '["React", "TypeScript", "D3.js", "WebSocket", "PostgreSQL"]',
        projectUrl: 'https://analytics-demo.alexjohnson.dev',
        startDate: new Date('2023-10-01'),
        endDate: new Date('2023-12-20'),
      },
    }),
  ]);

  // Create portfolio projects for Sarah
  const sarahPortfolio = await Promise.all([
    prisma.portfolioProject.create({
      data: {
        freelanceProfileId: sarahProfile.id,
        title: 'Mobile Banking App Design',
        description: 'Complete UI/UX design for a mobile banking application. Conducted user research, created wireframes, prototypes, and final designs.',
        technologies: '["Figma", "Principle", "User Research", "Prototyping"]',
        projectUrl: 'https://dribbble.com/shots/banking-app-sarah',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-10-30'),
      },
    }),
  ]);

  console.log('🎨 Created portfolio projects:', { alexPortfolio, sarahPortfolio });

  // Create company profiles
  const techStartupProfile = await prisma.companyProfile.upsert({
    where: { userId: company1.id },
    update: {},
    create: {
      userId: company1.id,
      companyName: 'InnovateTech Startup',
      industry: 'Technology',
      size: 'STARTUP',
      description: 'Fast-growing tech startup focused on AI-powered solutions for businesses. We build cutting-edge products that solve real-world problems.',
      website: 'https://innovatetech.startup',
      location: 'Paris, France',
    },
  });

  const fintechProfile = await prisma.companyProfile.upsert({
    where: { userId: company2.id },
    update: {},
    create: {
      userId: company2.id,
      companyName: 'FinanceFlow Solutions',
      industry: 'Financial Technology',
      size: 'MEDIUM',
      description: 'Leading fintech company providing innovative payment solutions and financial services to businesses across Europe.',
      website: 'https://financeflow.solutions',
      location: 'London, UK',
    },
  });

  console.log('🏢 Created company profiles:', { techStartupProfile, fintechProfile });

  // Create sample missions
  const mission1 = await prisma.mission.create({
    data: {
      companyProfileId: techStartupProfile.id,
      title: 'React/Next.js E-commerce Platform Development',
      description: 'We need an experienced React developer to build a modern e-commerce platform. The project includes payment integration, inventory management, and admin dashboard. Must have experience with Next.js, TypeScript, and modern React patterns.',
      requiredSkills: '["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"]',
      budget: 15000.00,
      duration: 6, // 6 weeks
      location: 'Remote',
      urgency: 'HIGH',
      status: 'OPEN',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  });

  const mission2 = await prisma.mission.create({
    data: {
      companyProfileId: fintechProfile.id,
      title: 'Mobile App UI/UX Design & Frontend Development',
      description: 'Looking for a talented designer/developer to create a beautiful and intuitive mobile banking app. Responsibilities include user research, wireframing, prototyping, and React Native development.',
      requiredSkills: '["UI/UX Design", "Figma", "React Native", "Mobile Design", "User Research"]',
      budget: 12000.00,
      duration: 8, // 8 weeks
      location: 'Hybrid (London)',
      urgency: 'NORMAL',
      status: 'OPEN',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    },
  });

  const mission3 = await prisma.mission.create({
    data: {
      companyProfileId: techStartupProfile.id,
      title: 'Blockchain Integration Specialist',
      description: 'Seeking a blockchain expert to integrate cryptocurrency payment solutions into our existing platform. Must have experience with Solidity, Web3, and DeFi protocols.',
      requiredSkills: '["Blockchain", "Solidity", "Web3", "DeFi", "Smart Contracts"]',
      budget: 20000.00,
      duration: 4, // 4 weeks
      location: 'Remote',
      urgency: 'URGENT',
      status: 'OPEN',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
  });

  console.log('🎯 Created missions:', { mission1, mission2, mission3 });

  // Create sample applications
  const application1 = await prisma.application.create({
    data: {
      missionId: mission1.id,
      freelanceProfileId: alexProfile.id,
      coverLetter: 'Hi! I\'m Alex, a senior React developer with 5+ years of experience. I\'ve built several e-commerce platforms similar to what you\'re looking for. I specialize in React, Next.js, and TypeScript, which are exactly the technologies you need. I can deliver a high-quality, scalable solution within your timeline. Let\'s discuss your project in detail!',
      proposedRate: 480.00,
      estimatedDuration: 6,
      status: 'PENDING',
    },
  });

  const application2 = await prisma.application.create({
    data: {
      missionId: mission2.id,
      freelanceProfileId: sarahProfile.id,
      coverLetter: 'Hello! I\'m Sarah, a UI/UX designer and frontend developer. I have extensive experience in mobile app design and have worked on several banking applications. I can handle both the design and React Native development aspects of your project. My approach focuses on user-centered design and creating intuitive interfaces.',
      proposedRate: 380.00,
      estimatedDuration: 8,
      status: 'REVIEWED',
    },
  });

  console.log('📋 Created applications:', { application1, application2 });

  // Create sample ratings
  const rating1 = await prisma.rating.create({
    data: {
      fromCompanyId: techStartupProfile.id,
      toFreelancerId: alexProfile.id,
      rating: 5,
      comment: 'Alex delivered exceptional work on our previous project. Highly professional, great communication, and delivered on time. Would definitely work with him again!',
    },
  });

  const rating2 = await prisma.rating.create({
    data: {
      fromFreelancerId: sarahProfile.id,
      toCompanyId: fintechProfile.id,
      rating: 4,
      comment: 'Great company to work with. Clear requirements, prompt payments, and professional team. The project was well-managed and enjoyable to work on.',
    },
  });

  console.log('⭐ Created ratings:', { rating1, rating2 });

  console.log('✅ SkillBridge Pro database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 