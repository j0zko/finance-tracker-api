export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare function generateAuthTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
};
//# sourceMappingURL=auth.service.d.ts.map