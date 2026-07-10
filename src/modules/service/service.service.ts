import prisma from '../../config/prisma';
import { ServiceFilterQuery, CreateServiceDto } from './service.interface';

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

// Returns the new service, or null if the category doesn't exist
export const createService = async (technicianProfileId: string, dto: CreateServiceDto) => {
  const category = await prisma.category.findUnique({ where: { id: dto.categoryId } });
  if (!category) return null;

  return prisma.service.create({
    data: {
      technicianId: technicianProfileId,
      categoryId: dto.categoryId,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      location: dto.location,
    },
  });
};