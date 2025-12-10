// src/prisma/prisma.service.ts

import { PrismaClient } from '@prisma/client';

// Instantiate PrismaClient once
const prisma = new PrismaClient();

// Export the single instance
export default prisma;
