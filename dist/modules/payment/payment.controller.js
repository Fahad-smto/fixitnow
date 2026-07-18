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
exports.handleWebhook = exports.getPaymentById = exports.confirmPayment = exports.getMyPayments = exports.createPayment = void 0;
const paymentService = __importStar(require("./payment.service"));
const stripe_1 = require("../../lib/stripe");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// POST /api/payments/create
const createPayment = async (req, res, next) => {
    try {
        const dto = req.body;
        if (!dto.bookingId) {
            res.status(400).json({ success: false, message: 'bookingId is required' });
            return;
        }
        const result = await paymentService.createPayment(req.user.id, dto.bookingId);
        if (!result) {
            res.status(400).json({ success: false, message: 'Booking not found or not yet ACCEPTED' });
            return;
        }
        res.status(201).json({ success: true, data: result }); // { paymentUrl }
    }
    catch (err) {
        next(err);
    }
};
exports.createPayment = createPayment;
// GET /api/payments
const getMyPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getMyPayments(req.user.id);
        res.status(200).json({ success: true, data: payments });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyPayments = getMyPayments;
const confirmPayment = async (req, res, next) => {
    try {
        const { transactionId, status } = req.body;
        if (!transactionId || !status) {
            res.status(400).json({ success: false, message: 'transactionId and status are required' });
            return;
        }
        const updatedPayment = await paymentService.confirmPayment({ transactionId, status });
        if (!updatedPayment) {
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        res.status(200).json({ success: true, data: updatedPayment });
    }
    catch (err) {
        next(err);
    }
};
exports.confirmPayment = confirmPayment;
// GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (!payment) {
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        const isOwner = payment.customerId === req.user.id;
        if (!isOwner && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }
        res.status(200).json({ success: true, data: payment });
    }
    catch (err) {
        next(err);
    }
};
exports.getPaymentById = getPaymentById;
const handleWebhook = async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    }
    catch (err) {
        console.log('⚠️  Webhook signature verification failed.', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log(`✅ Checkout session ${session.id} completed`);
                const updated = await paymentService.confirmPayment({
                    transactionId: session.id, // এখানেও session.id, payment_intent.id না
                    status: 'completed',
                });
                if (!updated) {
                    console.log(`⚠️  No matching payment found for transactionId: ${session.id}`);
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        next(err);
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=payment.controller.js.map