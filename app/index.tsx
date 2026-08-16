import { useRouter } from 'expo-router';

import { WelcomeScreen } from '../src/screens/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();

  function openLogin() {
    router.push('/login');
  }

  return <WelcomeScreen onLogin={openLogin} onStart={openLogin} />;
}
