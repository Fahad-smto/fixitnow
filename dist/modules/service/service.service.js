"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.findAllServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const findAllServices = async (filters) => {
    return prisma_1.default.service.findMany({
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
exports.findAllServices = findAllServices;
// Returns the new service, or null if the category doesn't exist
const createService = async (technicianProfileId, dto) => {
    const category = await prisma_1.default.category.findUnique({ where: { id: dto.categoryId } });
    if (!category)
        return null;
    return prisma_1.default.service.create({
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
exports.createService = createService;
//# sourceMappingURL=service.service.js.map