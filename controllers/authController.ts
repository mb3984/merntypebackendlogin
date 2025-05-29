import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// --- REGISTER ---
export const register: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// --- LOGIN ---
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return; // return void, not Response
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
    res.json({ token }); // last response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
  // function returns void
};

// Protected route to fetch all users (exclude passwords)
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
