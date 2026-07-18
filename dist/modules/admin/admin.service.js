"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.findAllCategories = exports.findAllBookings = exports.updateUserStatus = exports.findAllUsers = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const findAllUsers = async () => {
    return prisma_1.default.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } });
};
exports.findAllUsers = findAllUsers;
const updateUserStatus = async (id, dto) => {
    return prisma_1.default.user.update({ where: { id }, data: { status: dto.status } });
};
exports.updateUserStatus = updateUserStatus;
const findAllBookings = async () => {
    return prisma_1.default.booking.findMany({ include: { customer: true, technician: true, service: true } });
};
exports.findAllBookings = findAllBookings;
const findAllCategories = async () => {
    return prisma_1.default.category.findMany();
};
exports.findAllCategories = findAllCategories;
const createCategory = async (dto) => {
    return prisma_1.default.category.create({ data: dto });
};
exports.createCategory = createCategory;
//# sourceMappingURL=admin.service.js.map