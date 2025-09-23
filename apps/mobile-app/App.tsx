import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { StatusBar } from 'expo-status-bar';
import { Text, Button, Spinner } from '@gluestack-ui/themed';
import { View, ScrollView } from 'react-native';
import "./global.css"
import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async (queryType = 'hello') => {
    setLoading(true);
    setMessage('');

    try {
      let query;

      switch (queryType) {
        case 'hello':
          query = `query { hello }`;
          break;
        case 'greet':
          query = `query { greet(name: "Expo User") }`;
          break;
        case 'users':
          query = `query { users { id name email } }`;
          break;
        default:
          query = `query { hello }`;
      }

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setMessage(JSON.stringify(result, null, 2));
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure:\n1. Backend is running on port 4000\n2. You're using the correct GraphQL query`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <View className="flex-1 bg-gray-50 p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View className="space-y-6 items-center">
            <Text className="text-3xl font-bold text-gray-800 text-center">
              Welcome to Mobile App
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Expo + Gluestack UI + GraphQL + NativeWind
            </Text>

            <View className="space-y-3 w-64 gap-4">
              <Button
                onPress={() => testBackendConnection('hello')}
                isDisabled={loading}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg py-3"
              >
                {loading ? (
                  <Spinner color="$white" />
                ) : (
                  <Text className="text-white font-medium">Test Hello Query</Text>
                )}
              </Button>

              <Button
                onPress={() => testBackendConnection('greet')}
                isDisabled={loading}
                className="bg-green-600 hover:bg-green-700 rounded-lg py-3"
              >
                <Text className="text-white font-medium">Test Greet Query</Text>
              </Button>

              <Button
                onPress={() => testBackendConnection('users')}
                isDisabled={loading}
                className="bg-purple-600 hover:bg-purple-700 rounded-lg py-3"
              >
                <Text className="text-white font-medium">Test Users Query</Text>
              </Button>
            </View>

            {message ? (
              <View className="bg-gray-800 p-4 rounded-lg w-80 max-w-full">
                <Text className="text-sm text-gray-200 font-mono">
                  {message}
                </Text>
              </View>
            ) : null}

            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </View>
    </GluestackUIProvider>
  );
}