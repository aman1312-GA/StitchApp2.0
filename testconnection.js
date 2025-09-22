const { ApolloClient, InMemoryCache, gql
} = require('@apollo/client/core');
const fetch = require('node-fetch');

async function testBackend() {
  console.log('🧪 Testing GraphQL Backend...');

  try {
    const response = await fetch('http: //localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            hello
            greet(name: "Tester")
            }
        `
      }),
    });

    const result = await response.json();
    console.log('✅ Backend response:', JSON.stringify(result,
      null,
      2));
  } catch (error) {
    console.log('❌ Backend test failed:', error.message);
  }
}
// Run test if this file is executed directly
if (require.main === module) {
  testBackend();
}

module.exports = {
  testBackend
};