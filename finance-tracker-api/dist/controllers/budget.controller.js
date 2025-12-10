// src/controllers/budget.controller.ts
import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma.service.js';
// --- POST /api/v1/budgets - Create a new budget ---
export async function createBudget(req, res) {
    const { category, limit, year, month } = req.body;
    const userId = req.userId;
    if (!category || limit === undefined || !year || !month) {
        res.status(400).json({ error: 'Category, limit, year, and month are required.' });
        return;
    }
    try {
        // Prevent duplicate budgets for the same category/month/year
        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId: userId,
                category: category,
                year: year,
                month: month,
            },
        });
        if (existingBudget) {
            res.status(409).json({ error: 'A budget for this category and month already exists.' });
            return;
        }
        const newBudget = await prisma.budget.create({
            data: {
                category,
                limit: new Prisma.Decimal(limit),
                year: parseInt(year),
                month: parseInt(month),
                userId,
            },
        });
        res.status(201).json({ message: 'Budget created successfully', budget: newBudget });
    }
    catch (error) {
        console.error('Create Budget error:', error);
        res.status(500).json({ error: 'Internal server error while creating budget.' });
    }
}
// --- GET /api/v1/budgets - Get all budgets for a user ---
export async function getBudgets(req, res) {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated.' });
        return;
    }
    try {
        const budgets = await prisma.budget.findMany({
            where: {
                userId: userId,
            },
            orderBy: [
                { year: 'desc' },
                { month: 'desc' },
            ],
        });
        res.status(200).json(budgets);
    }
    catch (error) {
        console.error('Get Budgets error:', error);
        res.status(500).json({ error: 'Internal server error while fetching budgets.' });
    }
}
// NOTE: We would also implement updateBudget and deleteBudget here for full CRUD.
