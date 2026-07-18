"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getBookingsForTechnician = exports.updateAvailability = exports.updateProfile = exports.findTechnicianById = exports.findAllTechnicians = exports.getProfileByUserId = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// Booking/availability records are linked to TechnicianProfile.id, not User.id.
// This helper finds the profile that belongs to the logged-in user.
const getProfileByUserId = async (userId) => {
    return prisma_1.default.technicianProfile.findUnique({ where: { userId } });
};
exports.getProfileByUserId = getProfileByUserId;
const findAllTechnicians = async (filters) => {
    return prisma_1.default.technicianProfile.findMany({
        where: {
            rating: filters.rating ? { gte: Number(filters.rating) } : undefined,
        },
        include: { user: { select: { id: true, name: true, email: true } }, services: true },
    });
};
exports.findAllTechnicians = findAllTechnicians;
// Returns the technician profile, or null if not found
const findTechnicianById = async (id) => {
    return prisma_1.default.technicianProfile.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true } },
            services: true,
            bookings: { include: { review: true } },
        },
    });
};
exports.findTechnicianById = findTechnicianById;
const updateProfile = async (userId, dto) => {
    return prisma_1.default.technicianProfile.update({ where: { userId }, data: dto });
};
exports.updateProfile = updateProfile;
const updateAvailability = async (userId, slots) => {
    return prisma_1.default.technicianProfile.update({
        where: { userId },
        data: { availability: slots },
    });
};
exports.updateAvailability = updateAvailability;
const getBookingsForTechnician = async (technicianProfileId) => {
    return prisma_1.default.booking.findMany({
        where: { technicianId: technicianProfileId },
        include: { customer: { select: { id: true, name: true } }, service: true },
    });
};
exports.getBookingsForTechnician = getBookingsForTechnician;
// Returns the updated booking, or null if it doesn't belong to this technician
const updateBookingStatus = async (bookingId, technicianProfileId, dto) => {
    const booking = await prisma_1.default.booking.findFirst({
        where: { id: bookingId, technicianId: technicianProfileId },
    });
    if (!booking)
        return null;
    return prisma_1.default.booking.update({ where: { id: bookingId }, data: { status: dto.status } });
};
exports.updateBookingStatus = updateBookingStatus;
//# sourceMappingURL=technician.service.js.map