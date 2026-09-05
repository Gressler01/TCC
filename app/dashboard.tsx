import { useRouter } from 'expo-router';

import { DashboardScreen } from '../src/screens/DashboardScreen';

export default function DashboardRoute() {
  const router = useRouter();

  return (
    <DashboardScreen
      onNewSale={() => router.push('/new-sale')}
      onSales={() => router.push('/sales')}
      onExpenses={() => router.push('/expenses')}
      onHarvest={() => router.navigate('/harvest')}
    />
  );
}
