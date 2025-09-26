// JWT configuration
import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {

    // JWT Configuration
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SCRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessTokenExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
        refreshTokenExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
        issuer: process.env.JWT_ISSUER || 'StitchApp',
        audience: process.env.JWT_AUDIENCE || 'StitchAppUsers'
    },

    // Password Configuration
    password: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
        minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 6,
        maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH) || 128
    },

    // Session Configuration
    session: {
        maxRefreshTkens: parseInt(process.env.MAX_REFRESH_TOKENS) || 5, // max devices logged in 

    },

    // Rate Limiting
    rateLimiting: {
        loginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        lockoutTime: parseInt(process.env.LOCKOUT_TIME) || 15 * 60 * 1000,
        resetTime: parseInt(process.env.RESET_TIME) || 60 * 60 * 1000
    },

    // Account Settings
    account: {
        requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
        allowMultipleSessions: process.env.ALLOW_MULTIPLE_SESSIONS !== 'false',
    }
};

// Validate required environment variables
export const validateAuthConfig = () => {
    const required = [
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (process.env.JWT_ACCESS_SECRET.length < 32) {
        throw new Error('JWT_ACCESS_SECRET must be at least 32 characters long');
    }

    if (process.env.JWT_REFRESH_SECRET.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }

    console.log("Auth configuration validated");
};