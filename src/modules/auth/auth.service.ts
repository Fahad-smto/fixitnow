import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { RegisterDto, LoginDto } from './auth.interface';

// Returns the new user, or null if the email is already taken
export const registerUser = async (dto: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      phone: dto.phone,
    },
  });

  return newUser;
};

// Returns { token, user }, or null if email/password is wrong
export const loginUser = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordCorrect) {
    return null;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return { token, user };
};

// Returns the user, or null if not found
export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
};
