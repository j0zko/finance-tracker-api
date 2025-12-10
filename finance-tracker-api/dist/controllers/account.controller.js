// src/controllers/account.controller.ts
import { Prisma } from '@prisma/client';
import prisma from '../prisma/prisma.service.js';
//  GET /api/v1/accounts - Get all accounts for a user (Protected) 
export async function getAccounts(req, res) {
    // Get the user ID from the middleware
    const userId = req.userId;
    // Safety check (though middleware should prevent this)
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated.' });
        return;
    }
    try {
        const findManyOptions = {
            where: {
                // Filter accounts belonging ONLY to the authenticated user
                userId: userId,
            },
            select: {
                id: true,
                name: true,
                type: true,
                initialBalance: true,
                createdAt: true,
                updatedAt: true,
            }
        };
        const accounts = await prisma.account.findMany(findManyOptions);
        res.status(200).json(accounts);
    }
    catch (error) {
        console.error('Get Accounts error:', error);
        res.status(500).json({ error: 'Internal server error while fetching accounts.' });
    }
}
// --- POST /api/v1/accounts - Create a new account (Protected) ---
export async function createAccount(req, res) {
    // We use Request | AuthenticatedRequest here for type safety, though it should be protected
    const { name, type, initialBalance } = req.body;
    const userId = req.userId; // Get user ID from middleware
    if (!userId || !name || !type || initialBalance === undefined) {
        res.status(400).json({ error: 'User ID, name, type, and initial balance are required.' });
        return;
    }
    try {
        const newAccount = await prisma.account.create({
            data: {
                name,
                type,
                // Using Prisma.Decimal for monetary values
                initialBalance: new Prisma.Decimal(initialBalance),
                userId,
            },
        });
        res.status(201).json({
            message: 'Account created successfully',
            account: newAccount,
        });
    }
    catch (error) {
        console.error('Create Account error:', error);
        res.status(500).json({ error: 'Internal server error while creating account.' });
    }
}
