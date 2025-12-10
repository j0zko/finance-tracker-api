// src/controllers/transaction.controller.ts
import { Prisma, TransactionType } from '@prisma/client';
import prisma from '../prisma/prisma.service.js';
// --- POST /api/v1/transactions/transfer - Create a secure money transfer ---
export async function createTransfer(req, res) {
    const { date, amount, description, sourceAccountId, destinationAccountId } = req.body;
    const userId = req.userId;
    if (amount === undefined || !sourceAccountId || !destinationAccountId || sourceAccountId === destinationAccountId) {
        res.status(400).json({ error: 'Valid amount, source, and destination accounts are required for a transfer.' });
        return;
    }
    // Amount must be positive for a transfer
    const transferAmount = new Prisma.Decimal(amount);
    if (transferAmount.isZero() || transferAmount.isNegative()) {
        res.status(400).json({ error: 'Transfer amount must be positive.' });
        return;
    }
    try {
        // 1. Verify Ownership of both accounts
        const [sourceAccount, destinationAccount] = await Promise.all([
            prisma.account.findFirst({ where: { id: sourceAccountId, userId: userId } }),
            prisma.account.findFirst({ where: { id: destinationAccountId, userId: userId } }),
        ]);
        if (!sourceAccount || !destinationAccount) {
            res.status(403).json({ error: 'One or both accounts not found or access denied.' });
            return;
        }
        // 2. Execute the transfer using a database transaction
        // This ensures both operations succeed or both fail (atomicity). 
        const [expenseTransaction, incomeTransaction] = await prisma.$transaction([
            // Operation 1: EXPENSE (DEBIT) from Source Account
            prisma.transaction.create({
                data: {
                    date: date ? new Date(date) : new Date(),
                    amount: transferAmount,
                    description: description || `Transfer to ${destinationAccount.name}`,
                    category: 'Transfer',
                    type: 'EXPENSE',
                    accountId: sourceAccountId,
                    userId: userId,
                },
            }),
            // Operation 2: INCOME (CREDIT) to Destination Account
            prisma.transaction.create({
                data: {
                    date: date ? new Date(date) : new Date(),
                    amount: transferAmount,
                    description: description || `Transfer from ${sourceAccount.name}`,
                    category: 'Transfer',
                    type: 'INCOME',
                    accountId: destinationAccountId,
                    userId: userId,
                },
            }),
        ]);
        res.status(201).json({
            message: 'Transfer recorded successfully (Atomic Transaction)',
            transactions: {
                expense: expenseTransaction,
                income: incomeTransaction,
            }
        });
    }
    catch (error) {
        console.error('Create Transfer error:', error);
        res.status(500).json({ error: 'Internal server error while processing transfer.' });
    }
}
// --- POST /api/v1/transactions - Create a new standard transaction ---
export async function createTransaction(req, res) {
    const { date, amount, description, category, type, accountId } = req.body;
    const userId = req.userId;
    if (!accountId || amount === undefined || !type) {
        res.status(400).json({ error: 'Account ID, amount, and transaction type are required.' });
        return;
    }
    // Validation for TransactionType
    if (!Object.values(TransactionType).includes(type)) {
        res.status(400).json({ error: 'Invalid transaction type. Must be INCOME, EXPENSE, or TRANSFER.' });
        return;
    }
    try {
        // 1. Verify Account Ownership
        const account = await prisma.account.findFirst({
            where: { id: accountId, userId: userId }
        });
        if (!account) {
            res.status(403).json({ error: 'Account not found or access denied.' });
            return;
        }
        // 2. Create the Transaction
        const newTransaction = await prisma.transaction.create({
            data: {
                date: date ? new Date(date) : new Date(),
                amount: new Prisma.Decimal(amount),
                description,
                category,
                type: type,
                accountId,
                userId: userId,
            },
        });
        res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    }
    catch (error) {
        console.error('Create Transaction error:', error);
        res.status(500).json({ error: 'Internal server error while creating transaction.' });
    }
}
// --- GET /api/v1/transactions - Get all transactions for a user ---
export async function getTransactions(req, res) {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated.' });
        return;
    }
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
            },
            include: {
                account: {
                    select: { name: true, type: true }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Get Transactions error:', error);
        res.status(500).json({ error: 'Internal server error while fetching transactions.' });
    }
}
