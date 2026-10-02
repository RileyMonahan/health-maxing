import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useHydrated, useProfileStore } from '@/store';
import { colors } from '@/theme';

export default function RootLayout() {
  const hydrated = useHydrated();
  const onboarded = useProfileStore((s) => s.profile != null);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="check-in" options={{ presentation: 'modal' }} />
          <Stack.Screen name="log-weight" options={{ presentation: 'modal' }} />
          <Stack.Screen name="workout/session" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          <Stack.Screen name="workout/adjust" options={{ presentation: 'modal' }} />
          <Stack.Screen name="workout/exercise/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nutrition/search" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nutrition/scan" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nutrition/quick-add" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nutrition/food" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nutrition/meal/[meal]" />
          <Stack.Screen name="profile" />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
