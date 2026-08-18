import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAuthStore } from '@/stores/auth-store';
import { Link, Text, View } from '@/tw';

export function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch {
      // error is surfaced from the store
    }
  }

  return (
    <Screen className="px-6">
      <View className="flex-1 justify-center gap-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome back</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">Sign in to continue</Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
        </View>

        <Button label="Sign in" onPress={handleSubmit} loading={isSubmitting} disabled={!email || !password} />

        <View className="flex-row justify-center gap-1">
          <Text className="text-neutral-500 dark:text-neutral-400">Don’t have an account?</Text>
          <Link href="/(auth)/register">
            <Text className="font-semibold text-blue-600">Create one</Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
