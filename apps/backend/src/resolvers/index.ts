import { Resolver, Query, Mutation, Arg } from 'type-graphql';

@Resolver()
export class HelloResolver {
    @Query(() => String)
    async hello(): Promise<string> {
        return 'Hello from GraphQL Backend!';
    }

    @Query(() => String)
    async greet(@Arg('name') name: string): Promise<string> {
        return `Hello, ${name}! Welcome to our GraphQL API.`;
    }

    @Mutation(() => String)
    async createMessage(@Arg('message') message: string): Promise<string> {
        return `Message created: ${message}`;
    }
}

export const resolvers = [HelloResolver];