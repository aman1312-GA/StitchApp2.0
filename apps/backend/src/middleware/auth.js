// JWT verification middleware
import { AuthenticationError } from 'apollo-server-express'
import { verifyAccessToken } from '../utils/jwt'
import User from '../models/User'

export const authMiddleware = {
    requestDidStart() {
        return {
            async didResolveOperation({ request, document }) {
                // skip auth for introspection queries and auth mutations
                const definition = document.definitions[0];
                if (definition.kind === 'OperationDefintion') {
                    const operationName = definition.name?.value;
                    const selections = definition.selectionSet.selections

                    // skip auth for these operations
                    const publicOperations = ['login', 'register', 'refreshToken'];
                    const isPublicOperation = selections.some(selection =>
                        publicOperations.includes(selection.name.value)
                    );

                    if (isPublicOperation || definition.operation === 'query' &&
                        operationName === 'IntrospectionQuery'
                    ) {
                        return;
                    }
                }
            },

            async willSendResponse({ request, response, context }) {
                const authHeader = request.http.headers.authorization;

                if (authHeader && authHeader.startsWith("Bearer")) {
                    const token = authHeader.substring(7);

                    try {
                        const userId = verifyAccessToken(token);
                        const user = await User.findById(userId).select("-password -refreshTokens");

                        if (user) {
                            context.user = user;
                            context.isAuthenticated = true;
                        }
                    } catch (error) {
                        // token is invalid, but don't throw error here
                        // let resolvers handle authentication as needed
                    }
                }
            }
        }
    }
}

// helper function to require authentication in resolvers
export const requireAuth = (user) => {
    if (!user) {
        throw new AuthenticationError("You must be logged in to perform this action");
    }
    return user;
}