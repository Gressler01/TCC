import { useRouter } from 'expo-router';

import { LoginScreen } from '../src/screens/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();

  function handleLogin() {
    router.replace('/dashboard');
  }

  return <LoginScreen onSubmit={handleLogin} />;
}
