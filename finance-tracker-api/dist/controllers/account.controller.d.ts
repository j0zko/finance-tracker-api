import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
export declare function getAccounts(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function createAccount(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=account.controller.d.ts.map