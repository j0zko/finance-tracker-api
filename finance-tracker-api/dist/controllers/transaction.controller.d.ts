import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
export declare function createTransfer(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createTransaction(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getTransactions(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=transaction.controller.d.ts.map