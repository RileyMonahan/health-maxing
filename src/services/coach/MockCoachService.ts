import AsyncStorage from '@react-native-async-storage/async-storage';
import { createId, nowIso } from '@/domain/ids';
import type { Coach, CoachMessage } from '@/domain/models';
import type { CoachService } from './CoachService';
import { isWithinSupportHours } from './CoachService';

const KEY = 'hm:coach-messages';

const COACH: Coach = {
  id: 'coach_team',
  name: 'Coach Jordan',
  role: 'Health Maxing Coaching Team',
  initials: 'J',
  bio: 'Strength and nutrition coach. Here to help with training, food and habits.',
};

const WELCOME = "Welcome to Health Maxing! I'm your coach. Message me any time about training, food, sleep or anything else and the team will get back to you during support hours.";

const DEMO_REPLIES = [
  "Thanks for the message! (Demo reply: real coach messaging is coming soon.)",
  "Good question. Your coach will follow up here once live messaging is connected. (Demo reply)",
];

/** Local, on-device stand-in for the real coach backend. */
export class MockCoachService implements CoachService {
  readonly isMock = true;
  private listeners = new Set<(m: CoachMessage) => void>();
  private cache: CoachMessage[] | null = null;
  private replyIndex = 0;

  async getCoach(): Promise<Coach> {
    return COACH;
  }

  async listMessages(): Promise<CoachMessage[]> {
    if (this.cache) return [...this.cache];
    const raw = await AsyncStorage.getItem(KEY);
    this.cache = raw ? (JSON.parse(raw) as CoachMessage[]) : [];
    if (!this.cache.length) {
      this.cache.push({ id: createId('msg_'), sender: 'coach', body: WELCOME, createdAt: nowIso(), status: 'sent' });
      await this.save();
    }
    return [...this.cache];
  }

  async sendMessage(body: string): Promise<CoachMessage> {
    await this.listMessages();
    const msg: CoachMessage = { id: createId('msg_'), sender: 'client', body: body.trim(), createdAt: nowIso(), status: 'sent' };
    this.cache!.push(msg);
    await this.save();
    this.emit(msg);
    this.scheduleDemoReply();
    return msg;
  }

  subscribe(listener: (m: CoachMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private scheduleDemoReply() {
    setTimeout(async () => {
      const body = isWithinSupportHours()
        ? DEMO_REPLIES[this.replyIndex++ % DEMO_REPLIES.length]
        : "Thanks! The team is offline right now and will reply after 8am. (Demo reply)";
      const reply: CoachMessage = { id: createId('msg_'), sender: 'coach', body, createdAt: nowIso(), status: 'sent' };
      this.cache!.push(reply);
      await this.save();
      this.emit(reply);
    }, 1800);
  }

  private emit(m: CoachMessage) {
    this.listeners.forEach((l) => l(m));
  }

  private save() {
    return AsyncStorage.setItem(KEY, JSON.stringify(this.cache));
  }

  async clear() {
    this.cache = null;
    await AsyncStorage.removeItem(KEY);
  }
}
