import { Text } from 'react-native';
import { ModalHeader, OptionCard, Screen } from '@/components/ui';
import { EXPERIENCE_OPTIONS, GOAL_OPTIONS } from '@/features/onboarding/options';
import { useProfileStore } from '@/store';
import { type } from '@/theme';

export default function Goals() {
  const profile = useProfileStore((s) => s.profile)!;
  const update = useProfileStore((s) => s.updateProfile);

  return (
    <Screen edges={['top', 'bottom']}>
      <ModalHeader title="Goals" />
      <Text style={type.heading}>Main goals</Text>
      {GOAL_OPTIONS.map((g) => {
        const on = profile.goals.includes(g.id);
        return (
          <OptionCard
            key={g.id}
            title={g.label}
            icon={g.icon}
            selected={on}
            onPress={() => {
              const goals = on ? profile.goals.filter((x) => x !== g.id) : [...profile.goals, g.id];
              if (goals.length) update({ goals });
            }}
          />
        );
      })}
      <Text style={type.heading}>Training experience</Text>
      {EXPERIENCE_OPTIONS.map((o) => (
        <OptionCard key={o.id} title={o.label} description={o.description} icon={o.icon} selected={profile.experience === o.id} onPress={() => update({ experience: o.id })} />
      ))}
    </Screen>
  );
}
