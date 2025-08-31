#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@demo.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('demo123', 12);
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          userType: 'FREELANCER',
          isActive: true,
        }
      });
      
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create demo users
    const demoUsers = [
      {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'FREELANCER',
        profile: {
          skills: ['React', 'TypeScript', 'Node.js'],
          dailyRate: 150.00,
          availability: 40,
          experience: 3,
          bio: 'Experienced full-stack developer',
          location: 'San Francisco, CA'
        }
      },
      {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        userType: 'FREELANCER',
        profile: {
          skills: ['Python', 'Django', 'PostgreSQL'],
          dailyRate: 120.00,
          availability: 30,
          experience: 2,
          bio: 'Backend developer specializing in Python',
          location: 'New York, NY'
        }
      },
      {
        email: 'techcorp@example.com',
        firstName: 'TechCorp',
        lastName: 'Inc',
        userType: 'COMPANY',
        profile: {
          companyName: 'TechCorp Inc.',
          industry: 'Technology',
          size: 'MEDIUM',
          description: 'Leading technology company',
          website: 'https://techcorp.example.com',
          location: 'San Francisco, CA'
        }
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('demo123', 12);
        
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: userData.userType,
            isActive: true,
          }
        });

        // Create profile based on user type
        if (userData.userType === 'FREELANCER') {
          await prisma.freelanceProfile.create({
            data: {
              userId: user.id,
              ...userData.profile
            }
          });
        } else if (userData.userType === 'COMPANY') {
          await prisma.companyProfile.create({
            data: {
              userId: user.id,
              ...userData.profile
            }
          });
        }

        console.log(`✅ Created ${userData.userType} user: ${userData.email}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   Admin: admin@demo.com / demo123');
    console.log('   Freelancer: john@example.com / demo123');
    console.log('   Company: techcorp@example.com / demo123');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
