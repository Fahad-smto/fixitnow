"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingById = exports.getMyBookings = exports.createBooking = void 0;
const bookingService = __importStar(require("./booking.service"));
const technicianService = __importStar(require("../technician/technician.service"));
// POST /api/bookings
const createBooking = async (req, res, next) => {
    try {
        const dto = req.body;
        const booking = await bookingService.createBooking(req.user.id, dto);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Service not found' });
            return;
        }
        res.status(201).json({ success: true, data: booking });
    }
    catch (err) {
        next(err);
    }
};
exports.createBooking = createBooking;
// GET /api/bookings
const getMyBookings = async (req, res, next) => {
    try {
        const { id: userId, role } = req.user;
        let technicianProfileId;
        if (role === 'technician') {
            const profile = await technicianService.getProfileByUserId(userId);
            if (!profile) {
                res.status(404).json({ success: false, message: 'Technician profile not found' });
                return;
            }
            technicianProfileId = profile.id;
        }
        const bookings = await bookingService.findMyBookings(role, userId, technicianProfileId);
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyBookings = getMyBookings;
// GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.findBookingById(req.params.id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        const isOwner = booking.customerId === req.user.id;
        const isAllowed = isOwner || req.user.role === 'admin' || req.user.role === 'technician';
        if (!isAllowed) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        res.status(200).json({ success: true, data: booking });
    }
    catch (err) {
        next(err);
    }
};
exports.getBookingById = getBookingById;
//# sourceMappingURL=booking.controller.js.map