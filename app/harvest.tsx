import { useRouter } from 'expo-router';

import { HarvestScreen } from '../src/screens/HarvestScreen';

export default function HarvestRoute() {
  const router = useRouter();

  return (
    <HarvestScreen
      onGoHome={() => router.navigate('/dashboard')}
      onSales={() => router.navigate('/sales')}
    />
  );
}
