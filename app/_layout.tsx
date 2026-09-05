import { Stack } from 'expo-router';

import { HarvestProvider } from '../src/contexts/HarvestContext';

export default function RootLayout() {
  return (
    <HarvestProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HarvestProvider>
  );
}
