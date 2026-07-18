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
exports.createService = exports.getAllServices = void 0;
const serviceService = __importStar(require("./service.service"));
const technicianService = __importStar(require("../technician/technician.service"));
// GET /api/services
const getAllServices = async (req, res, next) => {
    try {
        const filters = req.query;
        const services = await serviceService.findAllServices(filters);
        res.status(200).json({ success: true, data: services });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllServices = getAllServices;
// POST /api/services (technician only)
const createService = async (req, res, next) => {
    try {
        const dto = req.body;
        if (!dto.categoryId || !dto.title || dto.price === undefined) {
            res.status(400).json({ success: false, message: 'categoryId, title and price are required' });
            return;
        }
        // Booking/service records use TechnicianProfile.id, not User.id,
        // so we first find the profile that belongs to the logged-in technician.
        const profile = await technicianService.getProfileByUserId(req.user.id);
        if (!profile) {
            res.status(404).json({ success: false, message: 'Technician profile not found. Update your profile first.' });
            return;
        }
        const service = await serviceService.createService(profile.id, dto);
        if (!service) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.status(201).json({ success: true, data: service });
    }
    catch (err) {
        next(err);
    }
};
exports.createService = createService;
//# sourceMappingURL=service.controller.js.map