// Environment variables
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config();

//Environment configuration
export const env = {
    // Server configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 4000,
    HOST: process.env.HOST || 'localhost',

    // Database configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-app',

    // Client Configuration
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4001',
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?
        process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'exp://localhost:19000'],

    // JWT Configuration
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || '15m',
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

    // Email Configuration
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,

    // File Upload Configuration
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5mb
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

    // Security Configuration
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    LOCKOUT_TIME: parseInt(process.env.LOCKOUT_TIME) || 15 * 60 * 1000,

    // Feature Flags
    REQUIRE_EMAIL_VERIFICATION: process.env.REQUIRE_EMAIL_VERIFICATION === 'true',
    ALLOW_MULTIPLE_SESSIONS: process.env.ALLOW_MULTIPLE_SESSIONS !== 'false',
    ENABLE_GRAPHQL_PLAYGROUND: process.env.ENABLE_GRAPHQL_PLAYGROUND !== 'false',

    // Loggin configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_FIle: process.env.LOG_FILE || './logs/app.log',
};

// Validation function
export const validateEnv = () => {
    const required = [
        'MONGODB_URI',
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET'
    ];

    const missing = required.filter(key => !env[key.replace('env.', '')])

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing);
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    console.log('✅ Environment variables validated');
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🚀 Server will run on: http://${env.HOST}:${env.PORT}`);
}

// Helper functions
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';