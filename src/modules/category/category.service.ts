import prisma from '../../config/prisma';
import { CreateCategoryDto } from './category.interface';

export const findAllCategories = async () => {
  return prisma.category.findMany();
};

export const createCategory = async (dto: CreateCategoryDto) => {
  return prisma.category.create({ data: dto });
};
