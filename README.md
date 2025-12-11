🚀 Finance Tracker API
Node.js
TypeScript
Express
Prisma
PostgreSQL
JWT
A secure, high-performance backend API built as the core service layer for a personal finance management platform. It enables authenticated endpoints for account management, transaction tracking, budgeting, and atomic funds transfers—prioritizing reliability, data integrity, and scalability.

📊 Key Capabilities
This API delivers essential backend features tailored to financial applications:

🔐 Authentication & Authorization
Role-agnostic JWT-based security for user registration, login, and protected routes. All sensitive endpoints require Authorization: Bearer <token>.
💼 Robust Account & Transaction Management
Comprehensive CRUD operations for:
User accounts
Financial accounts
Individual transactions

💸 Atomic Money Transfers
Executes transfers using Prisma’s $transaction wrapper for strict all-or-nothing behavior. Funds are debited and credited in a single atomic operation, preventing inconsistent states.
📈 Budget vs. Actuals Reporting
Integrated aggregation logic to calculate spending totals against predefined budgets, generating monthly financial reporting metrics.
⚡ High-Performance Querying
Transaction endpoints support:
Pagination: ?page=X&limit=Y
Date filtering: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
For efficient handling of large datasets.



🛠️ Technology Stack
