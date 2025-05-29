import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB";
import authRoutes from "./routes/auth";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3220;

// Connect to your database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Development mode: server running." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
