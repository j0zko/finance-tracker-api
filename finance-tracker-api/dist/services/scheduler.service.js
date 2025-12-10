// src/services/scheduler.service.ts
import * as cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function generateMonthlyReport() {
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    console.log(`\n--- 📅 Running Monthly Report Generator ---`);
    console.log(`Processing data for: ${lastMonth}/${year}`);
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    if (users.length === 0) {
        console.log('No users found to process.');
        return;
    }
    console.log(`Found ${users.length} users. Simulating report generation...`);
    users.forEach(user => {
        console.log(`   [Report] Simulated report generated for user: ${user.email}`);
    });
    console.log(`--- ✅ Monthly Report Finished --- \n`);
}
export const startScheduledJobs = () => {
    // Run at midnight on the 1st of every month
    const monthlyReportSchedule = '0 0 0 1 * *';
    cron.schedule(monthlyReportSchedule, generateMonthlyReport, {
        // REMOVED 'scheduled: true' to fix type error
        timezone: "Europe/Prague"
    });
    console.log('⏳ Scheduled jobs initialized: Monthly report set for the 1st of every month.');
};
