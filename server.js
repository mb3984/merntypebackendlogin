"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./utils/connectDB"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3220;
// Connect to your database
(0, connectDB_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// API routes
app.use("/api/auth", auth_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Development mode: server running." });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
