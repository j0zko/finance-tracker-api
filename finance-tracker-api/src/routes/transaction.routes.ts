// src/routes/transaction.routes.ts

import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transaction.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/v1/transactions - Record a new transaction (Protected)
router.post('/', authenticateJWT, createTransaction);

// ADDED: GET /api/v1/transactions - Fetch user's transactions (Protected)
router.get('/', authenticateJWT, getTransactions);

export default router;
