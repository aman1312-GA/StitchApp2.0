// auth type definition 
import { gql } from 'apollo-server-express'

export const authSchema = gql`
    type AuthPayload {
        accessToken: String!
        refreshToken: String!
        user: User!
        expiresIn: String!
    }

    type LoginSession {
        id: ID!
        deviceInfo: String
        createdInfo: Date!
        lastUsed: Date!
        isCurrentSession: Boolean!
    }

    # extend -> used to add new fields to the core Query and Mutation types.
    extend type Query {
        # Get all active sessions for current user.
        mySessions : [[LoginSession!]]! # returns an arrays of arrays where inner and outer arrays cannot be nnull.
    }

    extend type Mutation {
        # Authentication mutations
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        refreshToken(token: String!): AuthPayload!
        logout(refreshToken: String): Boolean! # If no token provided, logout current session
        logoutAll: Boolean # Logoout from all devices
        logoutSession(sessionId: ID!): Boolean! # Logout specific session

        # Password reset (for futire )
        requestPasswordReset(email: String!): Boolean!
        resetPassword(token: String!, newPassword: String!): Boolean!

        # Email verification
        sendVerificationEmail: Boolean!
        verifyEmail(token: String!): Boolean!
    }

    input RegisterInput {
        email: String!
        password: String!
        fullName: String!
    }

    input LoginInput {
        email: String!
        password: String!
        deviceInfo: String # Optional device tracking
    }
`