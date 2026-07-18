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
exports.privateRouter = exports.publicRouter = void 0;
const express_1 = require("express");
const technicianController = __importStar(require("./technician.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
// Public: GET /api/technicians, /api/technicians/:id
exports.publicRouter = (0, express_1.Router)();
exports.publicRouter.get('/', technicianController.getAllTechnicians);
exports.publicRouter.get('/:id', technicianController.getTechnicianById);
// Private: /api/technician/*  (technician role only)
exports.privateRouter = (0, express_1.Router)();
exports.privateRouter.put('/profile', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('technician'), technicianController.updateProfile);
exports.privateRouter.put('/availability', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('technician'), technicianController.updateAvailability);
exports.privateRouter.get('/bookings', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('technician'), technicianController.getMyBookings);
exports.privateRouter.patch('/bookings/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('technician'), technicianController.updateBookingStatus);
//# sourceMappingURL=technician.routes.js.map