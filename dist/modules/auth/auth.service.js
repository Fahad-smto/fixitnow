"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../config/prisma"));
// Returns the new user, or null if the email is already taken
const registerUser = async (dto) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
        return null;
    }
    const hashedPassword = await bcryptjs_1.default.hash(dto.password, 10);
    const newUser = await prisma_1.default.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            phone: dto.phone,
            technicianProfile: dto.role === 'technician' ? { create: {} } : undefined
        },
    });
    return newUser;
};
exports.registerUser = registerUser;
// Returns { token, user }, or null if email/password is wrong
const loginUser = async (dto) => {
    const user = await prisma_1.default.user.findUnique({ where: { email: dto.email } });
    if (!user) {
        return null;
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(dto.password, user.password);
    if (!isPasswordCorrect) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
};
exports.loginUser = loginUser;
// Returns the user, or null if not found
const getCurrentUser = async (userId) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.service.js.map