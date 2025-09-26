import { GraphQLScalarType, Kind } from "graphql";
import { userResolvers } from "./userResolvers.js";
import { authResolvers } from "./authResolvers.js";

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
        // Add subscription resolvers here when needed. (Used for real time, event-driven data like chat application)
    },


    // Type resolvers(if needed). This is custom field resovlers. This is useful if a field's vaule is not a direct match
    // from the database but needs to be computed from other fields. 
    // Ex - fullName can be computed by combining firstName and lastName. So, we can add a custom field resolver for fullName.
    // 
    // User: {
    //     // Add custom field resolvers here if needed
    //     fullName: (parent) => `${parent.firstName} ${parent.lastName}`,
    // }
}