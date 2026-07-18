"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Catches any unexpected error that happens inside a controller
// (e.g. a database connection issue). Normal "not found" / "invalid input"
// errors are handled directly inside each controller with res.status(...).
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong on the server' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map