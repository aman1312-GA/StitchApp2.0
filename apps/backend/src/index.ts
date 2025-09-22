import { ApolloServer, gql } from 'apollo-server';


// Type definitions
const typeDefs = gql`
  type Query {
    hello: String!
    greet(name: String!): String!
    users: [User!]!
  }

  type Mutation {
    createMessage(message: String!): String!
    createUser(name: String!, email: String!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }
`;

// Mock data
const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date().toISOString()
    }
];

// Resolvers
const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL Backend! 🚀',
        greet: (_: any, { name }: { name: string }) => `Hello, ${name}! Welcome to our GraphQL API.`,
        users: () => users,
    },
    Mutation: {
        createMessage: (_: any, { message }: { message: string }) => `Message created: ${message}`,
        createUser: (_: any, { name, email }: { name: string, email: string }) => {
            const newUser = {
                id: String(users.length + 1),
                name,
                email,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            return newUser;
        },
    },
};

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
        origin: ['http://localhost:8081', 'exp://localhost:19000', 'http://localhost:19006'],
        credentials: true,
    },
    context: ({ req, res }) => {
        // You can add authentication here
        return { req, res };
    },
});

// Start the server
server.listen(4000).then(({ url }) => {
    console.log('🚀 GraphQL Server Started successfully!');
    console.log(`📭 Query endpoint: ${url}`);
    console.log('\n🔍 Available queries:');
    console.log('   query { hello }');
    console.log('   query { greet(name: "World") }');
    console.log('   query { users { id name email } }');
    console.log('   mutation { createMessage(message: "Hello") }');
    console.log('   mutation { createUser(name: "Test", email: "test@test.com") { id name } }');
});