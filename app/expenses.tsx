import { useRouter } from 'expo-router';

import { ExpensesScreen } from '../src/screens/ExpensesScreen';

export default function ExpensesRoute() {
  const router = useRouter();

  return (
    <ExpensesScreen
      onGoHome={() => router.navigate('/dashboard')}
      onSales={() => router.navigate('/sales')}
    />
  );
}
