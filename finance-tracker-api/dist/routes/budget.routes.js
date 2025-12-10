// src/routes/budget.routes.ts
import { Router } from 'express';
import { createBudget, getBudgets } from '../controllers/budget.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
const router = Router();
// POST /api/v1/budgets - Create a new budget (Protected)
router.post('/', authenticateJWT, createBudget);
// GET /api/v1/budgets - Fetch user's budgets (Protected)
router.get('/', authenticateJWT, getBudgets);
export default router;
