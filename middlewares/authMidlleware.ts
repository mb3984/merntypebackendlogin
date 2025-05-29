import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return; // important: return after sending response, do NOT return the res object
  }

  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, jwtSecret);
    (req as any).userId = (payload as any).id;
    next(); // call next to pass control
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
    return; // return after response
  }
};
