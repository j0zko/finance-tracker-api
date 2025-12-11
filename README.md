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

Runtime,Node.js
Language,TypeScript
Framework,Express
Database,PostgreSQL
ORM,Prisma
Authentication,JSON Web Tokens (JWT)

🚀 Getting Started
Prerequisites
Ensure you have:

Node.js v18 or higher
A package manager: npm, pnpm, or yarn
Access to a PostgreSQL instance (local or cloud-based)

Installation & Setup

Clone the Repository
git clone https://github.com/j0zko/finance-tracker-api.git
cd finance-tracker-api

Install Dependencies
npm install

Configure Environment Variables
Create a .env file in the project root:
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker_db"

# JWT secret for signing access tokens
JWT_SECRET="YourSecureSecretKeyForJWTs"

Apply Database Migrations
Use Prisma to initialize the schema:
npx prisma migrate dev --name init

Build and Run the Server
# Compile TypeScript
npm run build

# Start the development server (with hot-reloading)
npm run dev

The API will be live at: http://localhost:3000


📝 Example Usage
All protected routes require an Authorization header with a valid JWT.

1.Register a User
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "SecurePassword123"}'

2. Log In and Retrieve JWT
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "SecurePassword123"}' | \
  grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "TOKEN is set to $TOKEN"

Fetch Paginated Transactions
Example with pagination and date filtering:
curl -s -X GET "http://localhost:3000/api/transactions?page=1&limit=10&startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer $TOKEN"

  🔒 Security & Best Practices

JWT Security: Use a strong, unique secret for JWT_SECRET.
Database: Ensure secure connection strings and consider SSL for production.
Error Handling: The API includes robust validation and error responses for reliability.

📬 Contact & Contributions
For questions or contributions, open an issue or pull request on GitHub.
