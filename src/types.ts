export type ScriptId =
  | 'latin' | 'hanja' | 'katakana' | 'hiragana'
  | 'thai' | 'greek' | 'egyptian' | 'cuneiform'
  | 'hebrew' | 'arabic' | 'rune';

export type Stage =
  | 'attract' | 'intro' | 'name' | 'scripts'
  | 'customize' | 'ticket';

export interface Candidate {
  scriptId: ScriptId;
  text: string;
  explanation?: string;
  seed: number;
}

export interface SyllableChoice {
  syllable: string;
  scriptId: ScriptId;
  text: string;
  explanation?: string;
}

// Character customization (the dress-up mini-game in S4)
export type ItemSlot = 'hat' | 'outfit' | 'badge' | 'background';

export interface CustomizationItem {
  id: string;
  slot: ItemSlot;
  labelKo: string;
  glyph: string;        // a unicode glyph representing the item
  color: string;        // accent color
  unlockedBy?: ScriptId; // which script unlocked it
}

export interface Customization {
  hat?: string;          // item id
  outfit?: string;
  badge?: string;
  background?: string;
}

export interface Ticket {
  id: string;
  userName: string;
  syllableMap: SyllableChoice[];
  customization: Customization;
  issuedAt: string;
  score: number;
  stars: number;
}
