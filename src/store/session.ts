import { create } from 'zustand';
import type {
  Candidate, Customization, Stage, SyllableChoice, Ticket,
} from '../types';
import { getCandidatesFor } from '../data/transliterations';
import { splitHangulSyllables } from '../utils/hangul';

interface SessionState {
  stage: Stage;
  locale: 'ko' | 'en' | 'ja' | 'zh';
  userName: string;
  syllables: string[];
  activeIndex: number;
  candidates: Record<number, Candidate[]>;
  picked: (SyllableChoice | null)[];

  // gaming
  score: number;
  combo: number;
  stars: number;

  customization: Customization;
  gender: 'boy' | 'girl';
  ticket: Ticket | null;

  // actions
  startSession: () => void;
  setLocale: (l: SessionState['locale']) => void;
  setUserName: (name: string) => void;
  setActiveIndex: (i: number) => void;
  pickFor: (i: number, c: Candidate) => void;
  unpick: (i: number) => void;
  addScore: (n: number) => void;

  setCustomization: (slot: keyof Customization, itemId: string) => void;
  setGender: (g: 'boy' | 'girl') => void;
  finalizeTicket: () => void;

  goTo: (s: Stage) => void;
  reset: () => void;
}

const initial = {
  stage: 'attract' as Stage,
  locale: 'ko' as const,
  userName: '',
  syllables: [] as string[],
  activeIndex: 0,
  candidates: {} as Record<number, Candidate[]>,
  picked: [] as (SyllableChoice | null)[],
  score: 0,
  combo: 0,
  stars: 0,
  customization: {} as Customization,
  gender: 'boy' as 'boy' | 'girl',
  ticket: null as Ticket | null,
};

export const useSession = create<SessionState>((set, get) => ({
  ...initial,

  startSession: () => set({ stage: 'intro' }),
  setLocale: (l) => set({ locale: l }),

  setUserName: (name) => {
    const syls = splitHangulSyllables(name);
    const cands: Record<number, Candidate[]> = {};
    syls.forEach((s, i) => { cands[i] = getCandidatesFor(s, i * 100); });
    set({
      userName: name,
      syllables: syls,
      candidates: cands,
      picked: Array(syls.length).fill(null),
      activeIndex: 0,
      score: 0,
      combo: 0,
      stars: 0,
    });
  },

  setActiveIndex: (i) => set({ activeIndex: i }),

  pickFor: (i, c) => {
    const { syllables, picked, combo, score } = get();
    const newPicked = picked.slice();
    newPicked[i] = {
      syllable: syllables[i],
      scriptId: c.scriptId,
      text: c.text,
      explanation: c.explanation,
    };
    const newCombo = combo + 1;
    const basePoints = 100;
    const comboBonus = Math.min(newCombo, 5) * 20;
    const gained = basePoints + comboBonus;
    // auto-advance to next empty slot
    let nextActive = i;
    for (let k = i + 1; k < newPicked.length; k++) {
      if (!newPicked[k]) { nextActive = k; break; }
    }
    if (nextActive === i) {
      // check earlier empty slots
      for (let k = 0; k < newPicked.length; k++) {
        if (!newPicked[k]) { nextActive = k; break; }
      }
    }
    set({
      picked: newPicked,
      score: score + gained,
      combo: newCombo,
      stars: Math.floor((score + gained) / 150),
      activeIndex: nextActive,
    });
  },

  unpick: (i) => {
    const { picked } = get();
    const newPicked = picked.slice();
    newPicked[i] = null;
    set({ picked: newPicked, combo: 0, activeIndex: i });
  },

  addScore: (n) => set((s) => ({ score: s.score + n })),

  setCustomization: (slot, itemId) =>
    set((s) => ({ customization: { ...s.customization, [slot]: itemId } })),

  setGender: (g) => set({ gender: g }),

  finalizeTicket: () => {
    const { userName, picked, customization, score, stars } = get();
    const syllableMap = picked.filter((p): p is SyllableChoice => !!p);
    const ticket: Ticket = {
      id: `T-${Date.now().toString(36).toUpperCase()}`,
      userName,
      syllableMap,
      customization,
      issuedAt: new Date().toISOString(),
      score,
      stars,
    };
    set({ ticket });
  },

  goTo: (s) => set({ stage: s }),
  reset: () => set({ ...initial }),
}));
