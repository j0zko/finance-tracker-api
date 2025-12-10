import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
export declare function createBudget(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getBudgets(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=budget.controller.d.ts.map