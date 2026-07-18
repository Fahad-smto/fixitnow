"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBookingById = exports.findMyBookings = exports.createBooking = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// Returns the new booking, or null if the service doesn't exist
const createBooking = async (customerId, dto) => {
    const service = await prisma_1.default.service.findUnique({ where: { id: dto.serviceId } });
    if (!service)
        return null;
    return prisma_1.default.booking.create({
        data: {
            customerId,
            technicianId: dto.technicianId,
            serviceId: dto.serviceId,
            timeSlot: new Date(dto.timeSlot),
            address: dto.address,
            notes: dto.notes,
            amount: service.price,
            status: 'REQUESTED',
        },
    });
};
exports.createBooking = createBooking;
const findMyBookings = async (role, userId, technicianProfileId) => {
    return prisma_1.default.booking.findMany({
        where: role === 'technician' ? { technicianId: technicianProfileId } : { customerId: userId },
        include: { service: true, technician: { include: { user: true } }, customer: true },
    });
};
exports.findMyBookings = findMyBookings;
// Returns the booking, or null if not found
const findBookingById = async (id) => {
    return prisma_1.default.booking.findUnique({
        where: { id },
        include: { service: true, technician: true, customer: true },
    });
};
exports.findBookingById = findBookingById;
//# sourceMappingURL=booking.service.js.map