// user graphql type definitions
import { gql } from 'apollo-server-express'

export const userSchema = gql`
    type User {
        id: ID!
        email: String!        
        fullName: String!
        isVerified: Boolean!
        createdAt: String!
        updatedAt: String!
        lastLogin: String
    }

    type Query{
        me: User
        users: [User!]! #Admin only
        user(id: ID!): User # Get specific user
    }

    type Mutation {
        changePassword(input: ChangePasswordInput!): Boolean!
        deleteAccount: Boolean!
    }

    input ChangePasswordInput{
        currentPassword: String!
        newPassword: String!
    }
`;