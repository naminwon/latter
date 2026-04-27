// Mock transliteration pool (kept compact for the prototype).
// For any given syllable, we pick candidates from this multi-script pool.
// Real version would call /api/transliterate. Here we build candidates
// deterministically per-syllable for stable demo behavior.

import type { Candidate, ScriptId } from '../types';

// Per-syllable hand-curated entries for the example name "나민원"
// (kept from the spec). Any other syllable falls back to a generic pool.
const BY_SYLLABLE: Record<string, Candidate[]> = {
  나: [
    { scriptId: 'latin', text: 'Na', explanation: '로마자 표기', seed: 1 },
    { scriptId: 'hanja', text: '娜', explanation: '한자 표기', seed: 2 },
    { scriptId: 'katakana', text: 'ナ', explanation: '가타카나', seed: 3 },
    { scriptId: 'hiragana', text: 'な', explanation: '히라가나', seed: 4 },
    { scriptId: 'thai', text: 'นา', explanation: '태국어', seed: 5 },
    { scriptId: 'egyptian', text: '𓈖', explanation: '이집트 상형', seed: 7 },
    { scriptId: 'cuneiform', text: '𒈾', explanation: '쐐기문자', seed: 8 },
  ],
  민: [
    { scriptId: 'latin', text: 'Min', explanation: '로마자 표기', seed: 11 },
    { scriptId: 'hanja', text: '民', explanation: '백성 민', seed: 12 },
    { scriptId: 'katakana', text: 'ミン', explanation: '가타카나', seed: 13 },
    { scriptId: 'hiragana', text: 'みん', explanation: '히라가나', seed: 14 },
    { scriptId: 'thai', text: 'มิน', explanation: '태국어', seed: 15 },
    { scriptId: 'egyptian', text: '𓏠𓇋𓈖', explanation: '이집트 상형', seed: 17 },
    { scriptId: 'cuneiform', text: '𒈪𒉌', explanation: '쐐기문자', seed: 18 },
  ],
  원: [
    { scriptId: 'latin', text: 'Won', explanation: '로마자 표기', seed: 21 },
    { scriptId: 'hanja', text: '源', explanation: '근원 원', seed: 22 },
    { scriptId: 'katakana', text: 'ウォン', explanation: '가타카나', seed: 23 },
    { scriptId: 'hiragana', text: 'うぉん', explanation: '히라가나', seed: 24 },
    { scriptId: 'thai', text: 'วอน', explanation: '태국어', seed: 25 },
    { scriptId: 'egyptian', text: '𓃭', explanation: '이집트 상형', seed: 27 },
    { scriptId: 'cuneiform', text: '𒊩', explanation: '쐐기문자', seed: 28 },
  ],
  지: [
    { scriptId: 'latin', text: 'Ji', seed: 31 },
    { scriptId: 'hanja', text: '智', explanation: '지혜 지', seed: 32 },
    { scriptId: 'katakana', text: 'ジ', seed: 33 },
    { scriptId: 'hiragana', text: 'じ', seed: 34 },
    { scriptId: 'thai', text: 'จี', seed: 35 },
    { scriptId: 'greek', text: 'Ζι', seed: 36 },
    { scriptId: 'egyptian', text: '𓆎', seed: 37 },
    { scriptId: 'cuneiform', text: '𒍣', seed: 38 },
  ],
  안: [
    { scriptId: 'latin', text: 'An', seed: 41 },
    { scriptId: 'hanja', text: '安', explanation: '편안할 안', seed: 42 },
    { scriptId: 'katakana', text: 'アン', seed: 43 },
    { scriptId: 'hiragana', text: 'あん', seed: 44 },
    { scriptId: 'thai', text: 'อัน', seed: 45 },
    { scriptId: 'greek', text: 'Αν', seed: 46 },
    { scriptId: 'egyptian', text: '𓂝𓈖', seed: 47 },
    { scriptId: 'cuneiform', text: '𒀭', seed: 48 },
  ],
};

// Fallback pool: generic glyphs per script, used if syllable isn't catalogued.
const GENERIC: Record<ScriptId, { text: string; explanation?: string }[]> = {
  latin: [{ text: 'A', explanation: '로마자' }, { text: 'E' }, { text: 'I' }, { text: 'O' }, { text: 'U' }],
  hanja: [{ text: '字', explanation: '글자 자' }, { text: '文' }, { text: '光' }, { text: '明' }, { text: '花' }],
  katakana: [{ text: 'カ' }, { text: 'キ' }, { text: 'タ' }, { text: 'ナ' }, { text: 'ラ' }],
  hiragana: [{ text: 'あ' }, { text: 'か' }, { text: 'た' }, { text: 'な' }, { text: 'ま' }],
  thai: [{ text: 'ก' }, { text: 'ข' }, { text: 'น' }, { text: 'ม' }, { text: 'ร' }],
  greek: [{ text: 'Α' }, { text: 'Β' }, { text: 'Γ' }, { text: 'Δ' }, { text: 'Ω' }],
  egyptian: [{ text: '𓂀' }, { text: '𓃭' }, { text: '𓈖' }, { text: '𓇯' }, { text: '𓎛' }],
  cuneiform: [{ text: '𒀀' }, { text: '𒂗' }, { text: '𒈾' }, { text: '𒊩' }, { text: '𒌋' }],
  hebrew: [{ text: 'נ' }, { text: 'מ' }, { text: 'ל' }, { text: 'ו' }, { text: 'ר' }],
  arabic: [{ text: 'ن' }, { text: 'م' }, { text: 'ل' }, { text: 'و' }, { text: 'ر' }],
  rune: [{ text: 'ᚾ' }, { text: 'ᛗ' }, { text: 'ᛚ' }, { text: 'ᚹ' }, { text: 'ᚱ' }],
};

const ALL_SCRIPTS: ScriptId[] = [
  'latin', 'hanja', 'katakana', 'hiragana', 'thai', 'greek', 'egyptian', 'cuneiform',
];

export function getCandidatesFor(syllable: string, seedOffset: number = 0): Candidate[] {
  if (BY_SYLLABLE[syllable]) return BY_SYLLABLE[syllable].map((c, i) => ({ ...c, seed: c.seed + seedOffset + i }));
  // Generic fallback: one glyph per script, picked deterministically from syllable
  const base = syllable.codePointAt(0) ?? 1;
  return ALL_SCRIPTS.map((sid, i) => {
    const pool = GENERIC[sid];
    const pick = pool[(base + i) % pool.length];
    return {
      scriptId: sid,
      text: pick.text,
      explanation: pick.explanation,
      seed: base + i + seedOffset,
    };
  });
}

// Fun decorative extras (ver09): per-syllable extra glyphs from scripts beyond
// the main 7. ver10: typed as Candidate so they pick into the slot like main cards.
const FUN_EXTRAS: Record<string, Candidate[]> = {
  나: [
    { scriptId: 'hebrew', text: 'נ', explanation: '히브리', seed: 91 },
    { scriptId: 'arabic', text: 'ن', explanation: '아랍', seed: 92 },
    { scriptId: 'rune', text: 'ᚾ', explanation: '룬', seed: 93 },
  ],
  민: [
    { scriptId: 'hebrew', text: 'מ', explanation: '히브리', seed: 94 },
    { scriptId: 'arabic', text: 'م', explanation: '아랍', seed: 95 },
    { scriptId: 'rune', text: 'ᛗ', explanation: '룬', seed: 96 },
  ],
  원: [
    { scriptId: 'hebrew', text: 'ו', explanation: '히브리', seed: 97 },
    { scriptId: 'arabic', text: 'و', explanation: '아랍', seed: 98 },
    { scriptId: 'rune', text: 'ᚹ', explanation: '룬', seed: 99 },
  ],
};

export function getFunExtrasFor(syllable: string, seedOffset: number = 0): Candidate[] {
  const list = FUN_EXTRAS[syllable] ?? [];
  return list.map((e, i) => ({ ...e, seed: e.seed + seedOffset + i }));
}

// ver23: cultural-context label for the "X 문화권" guidance line on Customize.
export const SCRIPT_CULTURE_KO: Record<ScriptId, string> = {
  latin: '영어',
  hanja: '한자',
  katakana: '일본',
  hiragana: '일본',
  thai: '태국',
  greek: '그리스',
  egyptian: '이집트',
  cuneiform: '메소포타미아',
  hebrew: '히브리',
  arabic: '아랍',
  rune: '북유럽',
};

export const SCRIPT_LABEL_KO: Record<ScriptId, string> = {
  latin: '로마자',
  hanja: '한자',
  katakana: '가타카나',
  hiragana: '히라가나',
  thai: '태국어',
  greek: '그리스',
  egyptian: '이집트',
  cuneiform: '쐐기문자',
  hebrew: '히브리',
  arabic: '아랍',
  rune: '룬',
};

export const SCRIPT_COLOR: Record<ScriptId, string> = {
  latin: '#4C9AFF',
  hanja: '#E76F51',
  katakana: '#F4A261',
  hiragana: '#F4A261',
  thai: '#9B5DE5',
  greek: '#00BBF9',
  egyptian: '#E4B363',
  cuneiform: '#8D6A9F',
  hebrew: '#10B981',
  arabic: '#EF4444',
  rune: '#7C3AED',
};
