import type { Coach, CoachMessage } from '@/domain/models';

/**
 * Contract for coach messaging. V1 uses MockCoachService (messages stay on the
 * device). A realtime backend (Supabase Realtime, Stream, Sendbird…) implements
 * these four methods and the chat UI keeps working unchanged.
 */
export interface CoachService {
  readonly isMock: boolean;
  getCoach(): Promise<Coach>;
  listMessages(): Promise<CoachMessage[]>;
  sendMessage(body: string): Promise<CoachMessage>;
  /** Called with every new or updated message. Returns an unsubscribe function. */
  subscribe(listener: (message: CoachMessage) => void): () => void;
}

export const SUPPORT_HOURS = { start: 8, end: 20, label: '8am–8pm' } as const;

export function isWithinSupportHours(now: Date = new Date()): boolean {
  const h = now.getHours();
  return h >= SUPPORT_HOURS.start && h < SUPPORT_HOURS.end;
}
