import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // Create sample SkillBridge Pro data
  const freelanceUser = await prisma.user.upsert({
    where: { email: 'freelancer@skillbridge.com' },
    update: {},
    create: {
      email: 'freelancer@skillbridge.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Developer',
      role: 'USER',
      userType: 'FREELANCER',
    },
  });

  const companyUser = await prisma.user.upsert({
    where: { email: 'company@skillbridge.com' },
    update: {},
    create: {
      email: 'company@skillbridge.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'USER',
      userType: 'COMPANY',
    },
  });

  // Create freelance profile
  const freelanceProfile = await prisma.freelanceProfile.upsert({
    where: { userId: freelanceUser.id },
    update: {},
    create: {
      userId: freelanceUser.id,
      bio: 'Senior React Developer with 5+ years of experience',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
      dailyRate: 500.00,
      availability: 40,
      location: 'Paris, France',
      experience: 5,
    },
  });

  // Create company profile
  const companyProfile = await prisma.companyProfile.upsert({
    where: { userId: companyUser.id },
    update: {},
    create: {
      userId: companyUser.id,
      companyName: 'TechStartup Inc',
      industry: 'Technology',
      size: 'STARTUP',
      description: 'Innovative startup building the next big thing',
      website: 'https://techstartup.com',
      location: 'San Francisco, CA',
    },
  });

  // Create sample mission
  const mission = await prisma.mission.create({
    data: {
      title: 'React Developer Needed for E-commerce Platform',
      description: 'Looking for a senior React developer to help build a modern e-commerce platform. Experience with TypeScript and Next.js required.',
      requiredSkills: ['React', 'TypeScript', 'Next.js'],
      budget: 8000.00,
      duration: 6,
      location: 'Remote',
      isRemote: true,
      companyId: companyProfile.id,
    },
  });

  console.log('🚀 Created SkillBridge Pro data:', {
    freelanceProfile,
    companyProfile,
    mission
  });

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 