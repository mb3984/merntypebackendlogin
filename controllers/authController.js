"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// --- REGISTER ---
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new User_1.default({ email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: "User registered" });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
        return;
    }
});
exports.register = register;
// --- LOGIN ---
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid credentials" });
            return; // return void, not Response
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
        res.json({ token }); // last response
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    // function returns void
});
exports.login = login;
// Protected route to fetch all users (exclude passwords)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}, { password: 0 });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getAllUsers = getAllUsers;
