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
exports.updateBookingStatus = exports.getMyBookings = exports.updateAvailability = exports.updateProfile = exports.getTechnicianById = exports.getAllTechnicians = void 0;
const technicianService = __importStar(require("./technician.service"));
// GET /api/technicians
const getAllTechnicians = async (req, res, next) => {
    try {
        const filters = req.query;
        const technicians = await technicianService.findAllTechnicians(filters);
        res.status(200).json({ success: true, data: technicians });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllTechnicians = getAllTechnicians;
// GET /api/technicians/:id
const getTechnicianById = async (req, res, next) => {
    try {
        const technician = await technicianService.findTechnicianById(req.params.id);
        if (!technician) {
            res.status(404).json({ success: false, message: 'Technician not found' });
            return;
        }
        res.status(200).json({ success: true, data: technician });
    }
    catch (err) {
        next(err);
    }
};
exports.getTechnicianById = getTechnicianById;
// PUT /api/technician/profile
const updateProfile = async (req, res, next) => {
    try {
        const dto = req.body;
        const updated = await technicianService.updateProfile(req.user.id, dto);
        res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
// PUT /api/technician/availability
const updateAvailability = async (req, res, next) => {
    try {
        const dto = req.body;
        const updated = await technicianService.updateAvailability(req.user.id, dto.slots);
        res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        next(err);
    }
};
exports.updateAvailability = updateAvailability;
// GET /api/technician/bookings
const getMyBookings = async (req, res, next) => {
    try {
        const profile = await technicianService.getProfileByUserId(req.user.id);
        if (!profile) {
            res.status(404).json({ success: false, message: 'Technician profile not found' });
            return;
        }
        const bookings = await technicianService.getBookingsForTechnician(profile.id);
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyBookings = getMyBookings;
// PATCH /api/technician/bookings/:id
const updateBookingStatus = async (req, res, next) => {
    try {
        const dto = req.body;
        const validStatuses = ['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED'];
        if (!validStatuses.includes(dto.status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }
        const profile = await technicianService.getProfileByUserId(req.user.id);
        if (!profile) {
            res.status(404).json({ success: false, message: 'Technician profile not found' });
            return;
        }
        const updated = await technicianService.updateBookingStatus(req.params.id, profile.id, dto);
        if (!updated) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        next(err);
    }
};
exports.updateBookingStatus = updateBookingStatus;
//# sourceMappingURL=technician.controller.js.map