// authentication resolvers
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-express';
import User from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { validateRegisterInput, validateLoginInput } from '../utils/validation.js'
import { requireAuth } from '../middleware/auth.js'
import { error } from 'console';

export const authResolvers = {
    Mutation: {
        register: async (_, { input }) => {
            try {
                // validate input
                const { errors, valid } = validateRegisterInput(input);
                if (!valid) {
                    throw new UserInputError('Validation errors', { validationErrors: errors })
                }

                // check if user already exists
                const existingUser = await User.findOne({ email: input.email });
                if (existingUser) {
                    throw new UserInputError('A user with this email already exists');
                }

                // Create new user
                const user = new User({
                    email: input.email.toLowerCase().trim(),
                    password: input.password,
                    fullName: input.fullName
                })

                await user.save();

                // Generate tokens
                const { accessToken, refreshToken } = generateTokens(user._id);

                // save refresh token
                user.refreshToken.push({
                    token: refreshToken,
                    deviceInfo: 'Registration Device'
                });

                user.lastLogin = new Date();
                await user.save();

                return {
                    accessToken,
                    refreshToken,
                    user,
                    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
                };
            } catch (error) {
                if (error.code === 11000) {
                    throw new UserInputError('A user with this email already exists')
                }
                throw error;
            }
        },

        login: async (_, { input }) => {

            // validate input
            const { errors, valid } = validateLoginInput(input);
            if (!valid) {
                throw new UserInputError('Validation errors', { validationErrors: errors })
            }

            // find user by email
            const user = await User.findOne({ email: input.email.toLowerCase() });
            if (!user) {
                throw new AuthenticationError('Invalid email or passsword');
            }

            // check password
            const isValidPassword = await user.comparePassword(input.password);
            if (!isValidPassword) {
                throw new AuthenticationError('Invalid email or password');
            }

            // clean up expired tokens
            user.cleanExpiredTokens();


            // Generate new tokens
            const { accessToken, refreshToken } = generateTokens(user._id);

            // save refresh token with device info
            user.refreshTokens.push({
                token: refreshToken,
                deviceInfo: input.deviceInfo || 'Unknown Device'
            });

            user.lastLogin = new Date();
            await user.save();

            return {
                accessToken,
                refreshToken,
                user,
                expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
            };
        },

        refreshToken: async (_, { token }) => {
            try {
                // verify refresh token
                const userId = verifyRefreshToken(token)?.userId;
                // find user and check if refresh token exists
                const user = await User.findById(userId);
                if (!user) {
                    throw new AuthenticationError('User not found')
                }

                // check if refresh token exists in database
                const tokenExists = user.refreshTokens.some(rt => rt.token === token);
                if (!tokenExists) {
                    throw new AuthenticationError('Invalid refresh token')
                }

                // clean up expired tokens
                user.cleanExpiredTokens();

                // Generate new tokens
                const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

                // Replace old refresh token with new one
                user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
                user.refreshTokens.push({
                    token: newRefreshToken,
                    deviceInfo: 'Refresh Token'
                });

                await user.save();

                return {
                    accessToken,
                    refreshToken: newRefreshToken,
                    user,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
                };
            } catch (error) {
                throw new AuthenticationError('Invalid or expired refresh token');
            }
        },

        logout: async (_, { refreshToken }, { user }) => {
            requireAuth(user);
            try {
                // remove the specific refresh token
                user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
                await user.save();
                return true;
            } catch (error) {
                return false;
            }
        },

        logoutAll: async (_, __, { user }) => {
            requireAuth(user);

            try {
                // remove all refresh tokens
                user.refreshTokens = [];
                await user.save();
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}