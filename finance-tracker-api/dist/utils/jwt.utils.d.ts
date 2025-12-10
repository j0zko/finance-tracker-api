interface TokenPayload {
    userId: string;
    email: string;
}
export declare function generateAccessToken(payload: TokenPayload): string;
export declare function generateRefreshToken(payload: TokenPayload): string;
export {};
//# sourceMappingURL=jwt.utils.d.ts.map