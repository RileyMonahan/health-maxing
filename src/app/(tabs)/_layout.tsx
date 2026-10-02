import { Tabs } from 'expo-router';
import { ColorValue, Platform } from 'react-native';
import { Icon, IconName } from '@/components/ui';
import { colors } from '@/theme';

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color }: { color: ColorValue }) => <Icon name={icon} size={26} color={color as string} />,
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8A96A3',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 6,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home')} />
      <Tabs.Screen name="tracking" options={{ ...tab('Tracking', 'dumbbell'), popToTopOnBlur: true }} />
      <Tabs.Screen name="progress" options={tab('Progress', 'chart-bar')} />
      <Tabs.Screen name="coach" options={tab('Coach', 'chat-outline')} />
    </Tabs>
  );
}
