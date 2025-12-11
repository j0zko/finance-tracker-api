# 💰 Finance Tracker API (Node.js, TypeScript, Prisma)

This project is a high-performance, secure backend API built to serve as the foundation for a personal finance management application. It provides robust, authenticated endpoints for tracking transactions, managing budgets, and performing secure atomic money transfers.

## ✨ Key Features

This API implements advanced backend capabilities crucial for a financial application:

1.  **JWT Authentication & Authorization:** Secure user registration, login, and protected endpoints using JSON Web Tokens.
2.  **Core CRUD Operations:** Full management of user **Accounts** and **Transactions**.
3.  **Secure Atomic Transfers:** Implemented using Prisma's `$transaction` to guarantee that funds are debited from a source account and credited to a destination account simultaneously (all-or-nothing atomicity), preventing data corruption. 
4.  **Budget vs. Actuals Reporting:** Aggregation logic to calculate actual monthly spending against defined budget limits, providing a comprehensive financial report.
5.  **Performance Optimization:** **Pagination (`?page=X&limit=Y`)** and **Filtering (`?startDate=X&endDate=Y`)** on the transactions endpoint for efficient handling of large datasets.

## 🛠️ Technology Stack

* **Backend:** Node.js, Express
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma (Handles database migration, schema, and queries)
* **Authentication:** JSON Web Tokens (JWT)

## 🏗️ Project Setup

### Prerequisites

You need the following installed on your machine:

* Node.js (v18 or higher)
* npm (or yarn/pnpm)
* PostgreSQL running locally (or a cloud provider connection string)

### 1. Clone the Repository

```bash
git clone https://github.com/j0zko/finance-tracker-api.git
cd finance-tracker-api

 2. Install Dependencies
npm install

3. Configure Environment Variables

Create a file named .env in the project root and add your PostgreSQL connection string:
Útržok kódu

# Example for a local PostgreSQL database
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker_db"
JWT_SECRET="YourSecureSecretKeyForJWTs"

4. Database Setup and Migrations

Use Prisma to push the schema to your database and generate the client code:
Bash

# Apply schema changes and generate Prisma client
npx prisma migrate dev --name init

5. Build and Run the Server

Compile the TypeScript code and start the server:
Bash

# Build the project (compiles TypeScript to JavaScript in the 'dist' folder)
npm run build

# Start the server using node (runs the compiled JS)
npm run dev

The API should now be running at http://localhost:3000.
⚙️ Example Usage

All API endpoints are protected by the Authorization: Bearer <TOKEN> header.
1. Register a User (Initial Setup)
Bash

curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "testuser@example.com", "password": "SecurePassword123"}'

2. Log In and Get Token

Use this command to automatically capture the token into a shell variable for testing:
Bash

export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "testuser@example.com", "password": "SecurePassword123"}' | \
grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "TOKEN is set to $TOKEN"

3. Test Paginated Transactions (Requires Account IDs from database)

Fetch the first page, limiting results to 10, and filtering by a date range:
Bash

curl -s -X GET "http://localhost:3000/api/transactions?page=1&limit=10&startDate=2025-01-01&endDate=2025-12-31" \
-H "Authorization: Bearer $TOKEN"


