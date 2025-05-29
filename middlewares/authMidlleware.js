"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return; // important: return after sending response, do NOT return the res object
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = payload.id;
        next(); // call next to pass control
    }
    catch (err) {
        res.status(403).json({ error: "Invalid token." });
        return; // return after response
    }
};
exports.authenticateToken = authenticateToken;
