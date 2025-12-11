Finance Tracker API

Node.js • TypeScript • Prisma • PostgreSQL

A secure, high-performance backend API designed as the core service layer for a personal finance management platform. It provides authenticated endpoints for account management, transaction tracking, budgeting, and atomic funds transfers—built with reliability and data integrity at its foundation.

Key Capabilities

The API implements a set of backend features aligned with financial-domain requirements, including:

1. Authentication & Authorization

Role-agnostic JWT-based security for registration, login, and protected routes. All sensitive endpoints require Authorization: Bearer <token>.

2. Robust Account & Transaction Management

Comprehensive CRUD operations for:

User accounts

Financial accounts

Individual transactions

3. Atomic Money Transfers

Transfers are executed using Prisma’s $transaction wrapper to ensure strict all-or-nothing behavior. Funds are debited and credited within a single atomic operation, eliminating risks of inconsistent state.

4. Budget vs. Actuals Reporting

Built-in aggregation logic calculates spending totals against predefined budgets to produce month-level financial reporting metrics.

5. High-Performance Querying

Transaction endpoints support:

Pagination: ?page=X&limit=Y

Date filtering: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

These enable efficient traversal of large transaction datasets.

Technology Stack
Category	Technology
Runtime	Node.js
Language	TypeScript
Framework	Express
Database	PostgreSQL
ORM	Prisma
Authentication	JSON Web Tokens (JWT)
Getting Started
Prerequisites

Ensure the following are installed:

Node.js v18+

npm, pnpm, or yarn

Access to a PostgreSQL instance (local or cloud)

Installation & Setup
1. Clone the Repository
git clone https://github.com/j0zko/finance-tracker-api.git
cd finance-tracker-api

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file in the project root:

# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker_db"

# JWT secret for signing access tokens
JWT_SECRET="YourSecureSecretKeyForJWTs"

4. Apply Database Migrations

Use Prisma to push the schema and generate the client:

npx prisma migrate dev --name init

5. Build and Run the Server
# Compile TypeScript
npm run build

# Start the development server
npm run dev


The API will be available at:
http://localhost:3000

Example Usage

All protected routes require:

Authorization: Bearer <TOKEN>

1. Register a User
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "SecurePassword123"}'

2. Log In and Retrieve JWT
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "SecurePassword123"}' | \
  grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "TOKEN is set to $TOKEN"

3. Fetch Paginated Transactions

Example request with pagination and date filtering:

curl -s -X GET "http://localhost:3000/api/transactions?page=1&limit=10&startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"
