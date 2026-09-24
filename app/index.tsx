import { useRouter } from 'expo-router';

import { WelcomeScreen } from '../src/screens/WelcomeScreen';

export default function IndexRoute() {
  const router = useRouter();

  return <WelcomeScreen onStart={() => router.replace('/dashboard')} />;
}
