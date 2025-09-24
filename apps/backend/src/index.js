import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers/index'
import { verifyAccessToken } from './utils/jwt'
import User from './models/User'
import { validateAuthConfig } from './config/auth.js'



async function startServer() {

    try {
        // Validate environment variables
        validateEnv();
        validateAuthConfig();

        // connect to database
        await connectDB();

        const app = express();

        // CORS configuration


        // CORS configuration
        app.use(cors({
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);

                if (env.ALLOWED_ORIGINS.includes(origin)) {
                    return callback(null, true);
                }

                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            },
            credentials: true
        }));

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                environment: env.NODE_ENV,
                timestamp: new Date().toISOString(),
                database: 'Connected'
            })
        })

        // Create apollo server with context
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async ({ req }) => {
                // Get token from headers 
                const authHeader = req.headers.authorization;
                let user = null;

                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    try {
                        const userId = verifyAccessToken(token);
                        user = await User.findById(userId).select('-password -refreshTokens')
                    } catch (error) {
                        // Token is invalid, user remains null
                        if (env.NODE_ENV === 'development') {
                            console.log('Invalid token: ', error.message)
                        }
                    }
                }

                return {
                    user,
                    isAuthenticated: !!user,
                    req
                };
            },
            // Enable graphQl playground in development
            introspection: process.env.NODE_ENV !== 'production',
            playground: process.env.NODE_ENV !== 'production',

            // Error formatting
            formatError: (error) => {
                // Log error for debugging
                console.error('GraphQL Error:', error)

                // Don't expose internal errors in production
                if (env.NODE_ENV === 'production' && error.message.startsWith('Database')) {
                    return new Error('Internal server error');
                }
                return error;
            }
        });

        await server.start();

        server.applyMiddleware({
            app,
            cors: false, // we alrady configured CORS above
            path: '/graphql'
        })

        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log('🎉 Server started successfully!');
            console.log(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
            console.log(`📊 GraphQL endpoint: http://${env.HOST}:${env.PORT}${server.graphqlPath}`);

            if (env.ENABLE_GRAPHQL_PLAYGROUND || env.NODE_ENV !== 'production') {
                console.log(`🎮 GraphQL Playground: http://${env.HOST}:${env.PORT}${server.graphqlPath}`);
            }

            console.log(`🏥 Health check: http://${env.HOST}:${env.PORT}/health`);

        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// start the server
startServer();