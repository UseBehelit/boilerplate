import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useTranslation } from '@/hooks/use-translation';
import { useAuthStore } from '@/stores/auth-store';
import { Link, Text, View } from '@/tw';

export function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      await register(name, email, password);
      router.replace('/(tabs)/home');
    } catch {
      // error is surfaced from the store
    }
  }

  return (
    <Screen className="px-6">
      <View className="flex-1 justify-center gap-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">{t('auth.register.title')}</Text>
          <Text className="text-base text-neutral-500 dark:text-neutral-400">{t('auth.register.subtitle')}</Text>
        </View>

        <View className="gap-4">
          <TextField label={t('auth.register.nameLabel')} value={name} onChangeText={setName} autoComplete="name" />
          <TextField
            label={t('auth.register.emailLabel')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label={t('auth.register.passwordLabel')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
          />
          {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
        </View>

        <Button
          label={t('auth.register.submit')}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!name || !email || !password}
        />

        <View className="flex-row justify-center gap-1">
          <Text className="text-neutral-500 dark:text-neutral-400">{t('auth.register.hasAccount')}</Text>
          <Link href="/(auth)/login">
            <Text className="font-semibold text-blue-600">{t('auth.register.signIn')}</Text>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
