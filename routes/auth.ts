import { Router } from "express";
// Use namespace import so each named export resolves correctly
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMidlleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// Protected route to get all users
router.get("/users", authenticateToken, authController.getAllUsers);

export default router;
