import prisma from '../../config/prisma';
import { UpdateUserStatusDto, CreateCategoryDto } from './admin.interface';

export const findAllUsers = async () => {
  return prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } });
};

export const updateUserStatus = async (id: string, dto: UpdateUserStatusDto) => {
  return prisma.user.update({ where: { id }, data: { status: dto.status } });
};

export const findAllBookings = async () => {
  return prisma.booking.findMany({ include: { customer: true, technician: true, service: true } });
};

export const findAllCategories = async () => {
  return prisma.category.findMany();
};

export const createCategory = async (dto: CreateCategoryDto) => {
  return prisma.category.create({ data: dto });
};
