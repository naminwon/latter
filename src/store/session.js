import { create } from 'zustand';
import { getCandidatesFor } from '../data/transliterations';
import { splitHangulSyllables } from '../utils/hangul';
const initial = {
    stage: 'attract',
    locale: 'ko',
    userName: '',
    syllables: [],
    activeIndex: 0,
    candidates: {},
    picked: [],
    score: 0,
    combo: 0,
    stars: 0,
    customization: {},
    gender: 'boy',
    ticket: null,
};
export const useSession = create((set, get) => ({
    ...initial,
    startSession: () => set({ stage: 'intro' }),
    setLocale: (l) => set({ locale: l }),
    setUserName: (name) => {
        const syls = splitHangulSyllables(name);
        const cands = {};
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
            if (!newPicked[k]) {
                nextActive = k;
                break;
            }
        }
        if (nextActive === i) {
            // check earlier empty slots
            for (let k = 0; k < newPicked.length; k++) {
                if (!newPicked[k]) {
                    nextActive = k;
                    break;
                }
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
    setCustomization: (slot, itemId) => set((s) => ({ customization: { ...s.customization, [slot]: itemId } })),
    setGender: (g) => set({ gender: g }),
    finalizeTicket: () => {
        const { userName, picked, customization, score, stars } = get();
        const syllableMap = picked.filter((p) => !!p);
        const ticket = {
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
