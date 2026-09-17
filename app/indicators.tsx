import { useLocalSearchParams, useRouter } from 'expo-router';

import { IndicatorsScreen } from '../src/screens/IndicatorsScreen';

export default function IndicatorsRoute() {
  const router = useRouter();
  const { period } = useLocalSearchParams<{ period?: string }>();

  return <IndicatorsScreen initialPeriod={period} onBack={() => router.back()} />;
}
