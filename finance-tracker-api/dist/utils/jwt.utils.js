// src/utils/jwt.utils.ts
import jwt from 'jsonwebtoken';
// Ensure these environment variables are loaded from your .env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export function generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m' // Short lifespan for security
    });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d' // Longer lifespan for refresh process
    });
}
