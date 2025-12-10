// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller.js';
const router = Router();
// POST /api/v1/auth/register - Create a new user (Public)
router.post('/register', register);
// POST /api/v1/auth/login - Authenticate and get tokens (Public)
router.post('/login', login);
// POST /api/v1/auth/refresh - Refresh tokens (Protected by refresh token logic)
router.post('/refresh', refresh);
export default router;
