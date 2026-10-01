import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ActivationGate } from '../src/components/ActivationGate';
import { HarvestProvider } from '../src/contexts/HarvestContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ActivationGate>
        <HarvestProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </HarvestProvider>
      </ActivationGate>
    </SafeAreaProvider>
  );
}
