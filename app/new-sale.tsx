import { useRouter } from 'expo-router';

import { NewSaleScreen } from '../src/screens/NewSaleScreen';

export default function NewSaleRoute() {
  const router = useRouter();

  return (
    <NewSaleScreen
      onBack={() => router.back()}
      onGoHome={() => router.replace('/dashboard')}
    />
  );
}
