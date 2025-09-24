import { GraphQLScalarType, Kind } from "graphql";
import { userResolvers } from "./userResolvers";
import { authResolvers } from "./authResolvers";

// Custom date scalar
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        throw new Error('Value is not an instance of Date');
    },

    parseValue(value) {
        if (typeof value === 'string') {
            return new Date(value);
        }
        throw new Error('Value is not a valid Date string');
    },

    parseLiteral(ast) {
        if (ast.king === Kind.STRING) {
            return new Date(ast.value);
        }
        throw new Error('Can only parse strings to dates but got a: ' + ast.kind);
    }
});

// Combine all resolvers
export const resolvers = {
    // Custom Scalars
    Date: dateScalar,

    // Base resolvers
    Query: {
        ...userResolvers.Query,
        // Add other query resolvers here
    },

    Mutation: {
        ...authResolvers.Mutation,
        ...userResolvers.Mutation
        // Add other mutation resolvers here
    },

    Subscription: {
        // Add subscription resolvers here when needed
    },

    // Type resolvers(if needed)
    // User: {
    //     // Add custom field resolvers here if needed
    //     fullName: (parent) => `${parent.firstName} ${parent.lastName}`,
    // }
}