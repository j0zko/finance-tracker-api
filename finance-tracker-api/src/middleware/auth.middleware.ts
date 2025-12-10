// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
// Added 'void' return type to the function signature for clarity, though Express handles the response.
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Explicit return
    res.status(401).json({ message: 'Access Denied: No Token Provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    // Explicit return
    res.status(401).json({ message: 'Access Denied: Invalid Token Format' });
    return;
  }

  try {
    if (!ACCESS_TOKEN_SECRET) {
      console.error("ACCESS_TOKEN_SECRET not set.");
      res.status(500).json({ message: 'Server configuration error.' });
      return;
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch (ex) {
    // Explicit return
    res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    return;
  }
};
