// src/server.ts

import express from 'express';
import accountRouter from './routes/account.routes.js';
import cors from 'cors';
import AuthRouter from './routes/auth.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import budgetRouter from './routes/budget.routes.js';
// if something goes wrong with env variables, uncomment this to debug
// console.log('--- ENV CHECK ---');
// console.log('DATABASE_URL:', process.env.DATABASE_URL);
// console.log('--- ENV CHECK END ---');


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for development

// Mount Routers

app.use('/api/accounts', accountRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/budgets', budgetRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
});
