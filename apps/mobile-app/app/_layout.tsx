import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
