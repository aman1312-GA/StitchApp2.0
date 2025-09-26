import { gql } from 'apollo-server-express';
import { userSchema } from './userSchema.js';
import { authSchema } from './authSchema.js';

// Base schema with Query and Mutation types
const baseSchema = gql`
    scalar Date
    
    type Query {
        _: Boolean
    }

    type Mutation {
        _: Boolean
    }

    type Subscription {
        _: Boolean
    }
`;

// Combine all Schemas 
export const typeDefs = [
    baseSchema,
    userSchema,
    authSchema
]