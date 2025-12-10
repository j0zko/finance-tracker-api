// src/routes/account.routes.ts
import { Router } from 'express';
// FIX 1: Import both controller functions
import { getAccounts, createAccount } from '../controllers/account.controller.js';
// The import for authenticateJWT is correct
import { authenticateJWT } from '../middleware/auth.middleware.js';
const router = Router();
// --- GET /api/v1/accounts - Get all accounts (Protected) ---
// FIX 3: Re-enable the GET route with authentication middleware
router.get('/', authenticateJWT, getAccounts);
// --- POST /api/v1/accounts - Create an account (Protected) ---
// FIX 2: Correctly use the createAccount handler
router.post('/', authenticateJWT, createAccount);
export default router;
