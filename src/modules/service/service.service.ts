import prisma from '../../config/prisma';
import { ServiceFilterQuery } from './service.interface';

export const findAllServices = async (filters: ServiceFilterQuery) => {
  return prisma.service.findMany({
    where: {
      category: filters.type ? { name: filters.type } : undefined,
      location: filters.location ? { contains: filters.location, mode: 'insensitive' } : undefined,
      price: {
        gte: filters.minPrice ? Number(filters.minPrice) : undefined,
        lte: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      },
    },
    include: { category: true, technician: true },
  });
};
