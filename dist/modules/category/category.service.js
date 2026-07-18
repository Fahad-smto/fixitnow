"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.findAllCategories = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const findAllCategories = async () => {
    return prisma_1.default.category.findMany();
};
exports.findAllCategories = findAllCategories;
const createCategory = async (dto) => {
    return prisma_1.default.category.create({ data: dto });
};
exports.createCategory = createCategory;
//# sourceMappingURL=category.service.js.map