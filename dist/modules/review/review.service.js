"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.findBookingById = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
// Returns the booking, or null if it doesn't exist
const findBookingById = async (bookingId) => {
    return prisma_1.default.booking.findUnique({ where: { id: bookingId } });
};
exports.findBookingById = findBookingById;
const createReview = async (customerId, dto, technicianId) => {
    return prisma_1.default.review.create({
        data: {
            bookingId: dto.bookingId,
            customerId,
            technicianId,
            rating: dto.rating,
            comment: dto.comment,
        },
    });
};
exports.createReview = createReview;
//# sourceMappingURL=review.service.js.map