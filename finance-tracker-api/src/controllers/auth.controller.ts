// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/prisma.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';
// Note: AuthenticatedRequest is generally not needed here since these are public routes
// or rely on token verification (like refresh), but you might use it later.
// import { AuthenticatedRequest } from '../middleware/auth.middleware.js'; 

// --- POST /api/v1/auth/register - Create a new user ---
export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    // 1. Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists.' });
      return;
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        // The field name must match the schema: passwordHash
        passwordHash: hashedPassword,
        firstName,
        lastName,
      },
      // Do not send the password hash back to the client
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: 'User registered successfully. Proceed to login.',
      user: newUser,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
}


// --- POST /api/v1/auth/login - Authenticate user ---
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    // 1. Find the user by email, selecting the hash
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // 3. Generate JWT tokens
    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 4. Return tokens
    res.status(200).json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
}


// --- POST /api/v1/auth/refresh - Refresh tokens ---
// Note: This endpoint is complex and requires saving/checking the refresh token in the DB.
// It remains a stub for now.
export async function refresh(req: Request, res: Response): Promise<void> {
  res.status(501).json({ message: "Refresh token endpoint not fully implemented" });
}
