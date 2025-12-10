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
// --- GET /api/v1/budgets/report?year=YYYY&month=MM - Budget vs. Actuals Report ---
export async function getBudgetReport(req, res) {
    const userId = req.userId;
    const { year, month } = req.query;
    if (!userId || !year || !month) {
        res.status(400).json({ error: 'User ID, year, and month are required query parameters.' });
        return;
    }
    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);
    if (isNaN(numericYear) || isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12) {
        res.status(400).json({ error: 'Invalid year or month value provided.' });
        return;
    }
    try {
        // 1. Fetch all budgets for the user for the specific month/year
        const budgets = await prisma.budget.findMany({
            where: {
                userId: userId,
                year: numericYear,
                month: numericMonth,
            },
        });
        // 2. Calculate actual expenses for the month, grouped by category
        // The dates are calculated to query only transactions within the target month.
        const startDate = new Date(numericYear, numericMonth - 1, 1);
        const endDate = new Date(numericYear, numericMonth, 0);
        const expenses = await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId: userId,
                type: 'EXPENSE',
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                category: {
                    // Only include transactions for categories that have a budget defined
                    in: budgets.map(b => b.category),
                }
            },
            _sum: {
                amount: true,
            },
        });
        // 3. Combine budgets and expenses into the final report structure
        // 
        const report = budgets.map(budget => {
            const actualSpending = expenses.find(e => e.category === budget.category);
            // Convert Decimal to Number for clean calculation
            const actual = actualSpending?._sum.amount?.toNumber() || 0;
            const limit = budget.limit.toNumber();
            return {
                category: budget.category,
                budgetLimit: limit,
                actualSpending: actual,
                remaining: limit - actual,
                isOverBudget: actual > limit,
            };
        });
        res.status(200).json(report);
    }
    catch (error) {
        console.error('Budget Report error:', error);
        res.status(500).json({ error: 'Internal server error while generating report.' });
    }
}
