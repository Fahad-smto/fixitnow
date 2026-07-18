import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma';
 

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@fixitnow@gmail.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('Admin created:', admin.email);
}

main().finally(() => {});