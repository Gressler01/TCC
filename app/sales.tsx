import { useRouter } from 'expo-router';

import { SalesScreen } from '../src/screens/SalesScreen';

export default function SalesRoute() {
  const router = useRouter();

  return <SalesScreen onNewSale={() => router.push('/new-sale')} />;
}
