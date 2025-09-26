// JWT token utilitie
import jwt from 'jsonwebtoken'

export const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId, type: 'access' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    )

    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    )

    return { accessToken, refreshToken };
}

export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if (decoded.type !== 'access') {
            throw new Error("Invalid token type")
        }
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid or expired access token")
    }
}

export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        if (decoded.type !== 'refresh') {
            throw new Error("Invalid token type");
        }
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
}