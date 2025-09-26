// user-related graphql resolvers
import { UserInputError } from 'apollo-server-express';
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js';
import { validateRegisterInput } from '../utils/validation.js';
import bcrypt from 'bcryptjs'
import { Mutation, Query } from 'type-graphql';

export const userResolvers = {
    Query: {
        me: async (_, __, { user }) => {
            return requireAuth(user);
        },
        users: async (_, __, { user }) => {
            requireAuth(user);
            // Add admin check if needed
            return await User.find({}).select('-password -refreshTokens');
        }
    },

    Mutation: {
        changePassword: async (_, { input }, { user }) => {
            requireAuth(user);

            // Verify current password
            const currentUser = await User.findById(user._id);
            const isCurrentPasswordValid = await currentUser.comparePassword(input.currentPassword);
            if (!isCurrentPasswordValid) {
                throw new UserInputError('Current password is incorrect');
            }

            // validate new password
            if (input.newPassword.length < 6) {
                throw new UserInputError("New password must be at least 6 characters")
            }

            // update password(will be hashed by pre-save hook)
            currentUser.password = input.newPassword;

            // clear all refresh tokens(force re-login on all devices)
            currentUser.refreshTokens = [];

            await currentUser.save();
            return true;
        },

        deleteAccount: async (_, __, { user }) => {
            requireAuth(user);
            try {
                await User.findByIdAndDelete(user._id);
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}