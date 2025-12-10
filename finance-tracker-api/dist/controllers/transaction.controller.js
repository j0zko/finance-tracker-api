import { Prisma, TransactionType } from '@prisma/client';
import prisma from '../prisma/prisma.service.js';
// Helper to safely convert to Prisma.Decimal
const toDecimal = (value) => {
    return new Prisma.Decimal(value);
};
// --- POST /api/v1/transactions ---
export async function createTransaction(req, res) {
    const { date, amount, description, category, type, accountId } = req.body;
    const userId = req.userId;
    // Required fields
    if (!accountId || amount === undefined || !type) {
        res.status(400).json({
            error: 'Account ID, amount, and transaction type are required.',
        });
        return;
    }
    // Validate enum value
    if (!Object.values(TransactionType).includes(type)) {
        res.status(400).json({
            error: 'Invalid transaction type. Must be INCOME, EXPENSE, or TRANSFER.',
        });
        return;
    }
    try {
        // 1. Verify account ownership
        const account = await prisma.account.findFirst({
            where: {
                id: accountId,
                userId: userId, // explicitly write userId: userId to satisfy strict object literal checks
            },
        });
        if (!account) {
            res.status(403).json({ error: 'Account not found or you do not have access.' });
            return;
        }
        // 2. Create transaction
        const transaction = await prisma.transaction.create({
            data: {
                date: date ? new Date(date) : new Date(),
                amount: toDecimal(amount),
                description: description ?? null,
                category: category ?? null,
                type: type, // safe because we validated above
                accountId,
                userId: userId, // explicitly write userId: userId
            },
        });
        res.status(201).json({
            message: 'Transaction created successfully',
            transaction,
        });
    }
    catch (error) {
        console.error('Create Transaction error:', error);
        res.status(500).json({ error: 'Failed to create transaction.' });
    }
}
// --- GET /api/v1/transactions ---
export async function getTransactions(req, res) {
    const userId = req.userId;
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId, // explicitly write userId: userId
            },
            include: {
                account: {
                    select: { name: true, type: true },
                },
            },
            orderBy: { date: 'desc' },
        });
        res.json(transactions);
    }
    catch (error) {
        console.error('Get Transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch transactions.' });
    }
}
