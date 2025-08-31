import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function globalTeardown() {
  // Clean up database connections
  await prisma.$disconnect();
  
  // Additional cleanup if needed
  console.log('Test teardown completed');
}
