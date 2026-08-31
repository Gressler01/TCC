import { useRouter } from 'expo-router';

import { SalesScreen } from '../src/screens/SalesScreen';

export default function SalesRoute() {
  const router = useRouter();

  return <SalesScreen onGoHome={() => router.replace('/dashboard')} />;
}
