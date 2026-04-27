// Items themed per script. ver12: every item is themed via `unlockedBy` so that
// the chosen syllable→script mapping fully drives the item palette.
// Slot mapping (ver12): position 0 → background, 1 → hat, 2 → outfit, 3 → badge.
export const ITEMS = [
    // ─── Hats ────────────────────────────────────────────
    { id: 'hat_pharaoh', slot: 'hat', labelKo: '파라오 왕관', glyph: '👑', color: '#E4B363', unlockedBy: 'egyptian' },
    { id: 'hat_nemes', slot: 'hat', labelKo: '네메스 두건', glyph: '🧣', color: '#D4A24C', unlockedBy: 'egyptian' },
    { id: 'hat_samurai', slot: 'hat', labelKo: '사무라이 투구', glyph: '⛩️', color: '#E76F51', unlockedBy: 'katakana' },
    { id: 'hat_kanmuri', slot: 'hat', labelKo: '관모', glyph: '🎏', color: '#C44536', unlockedBy: 'katakana' },
    { id: 'hat_hachimaki', slot: 'hat', labelKo: '하치마키', glyph: '🎌', color: '#F4A261', unlockedBy: 'hiragana' },
    { id: 'hat_kasa', slot: 'hat', labelKo: '삿갓', glyph: '🌾', color: '#E2A663', unlockedBy: 'hiragana' },
    { id: 'hat_laurel', slot: 'hat', labelKo: '월계관', glyph: '🌿', color: '#00BBF9', unlockedBy: 'greek' },
    { id: 'hat_helmet', slot: 'hat', labelKo: '코린트 투구', glyph: '🛡️', color: '#4FB1D9', unlockedBy: 'greek' },
    { id: 'hat_scholar', slot: 'hat', labelKo: '학자 모자', glyph: '🎓', color: '#4C9AFF', unlockedBy: 'hanja' },
    { id: 'hat_gat', slot: 'hat', labelKo: '갓', glyph: '🎩', color: '#385995', unlockedBy: 'hanja' },
    { id: 'hat_lotus', slot: 'hat', labelKo: '연꽃 티아라', glyph: '🪷', color: '#9B5DE5', unlockedBy: 'thai' },
    { id: 'hat_chada', slot: 'hat', labelKo: '차다 왕관', glyph: '👸', color: '#7E3FAA', unlockedBy: 'thai' },
    { id: 'hat_pirate', slot: 'hat', labelKo: '해적 모자', glyph: '🏴‍☠️', color: '#4C9AFF', unlockedBy: 'latin' },
    { id: 'hat_top', slot: 'hat', labelKo: '실크햇', glyph: '🎩', color: '#264653', unlockedBy: 'latin' },
    { id: 'hat_horns', slot: 'hat', labelKo: '뿔 투구', glyph: '🐂', color: '#8D6A9F', unlockedBy: 'cuneiform' },
    { id: 'hat_ziggurat', slot: 'hat', labelKo: '지구라트 관', glyph: '🏯', color: '#B58968', unlockedBy: 'cuneiform' },
    { id: 'hat_keffiyeh', slot: 'hat', labelKo: '케피예', glyph: '🧕', color: '#EF4444', unlockedBy: 'arabic' },
    { id: 'hat_kippah', slot: 'hat', labelKo: '키파', glyph: '✡️', color: '#10B981', unlockedBy: 'hebrew' },
    { id: 'hat_horned_rune', slot: 'hat', labelKo: '뿔 투구(룬)', glyph: '🪓', color: '#7C3AED', unlockedBy: 'rune' },
    // ─── Outfits ─────────────────────────────────────────
    { id: 'outfit_toga', slot: 'outfit', labelKo: '토가', glyph: '🏛️', color: '#00BBF9', unlockedBy: 'greek' },
    { id: 'outfit_chiton', slot: 'outfit', labelKo: '키톤', glyph: '🥻', color: '#48B0C7', unlockedBy: 'greek' },
    { id: 'outfit_kimono', slot: 'outfit', labelKo: '기모노', glyph: '🎎', color: '#F4A261', unlockedBy: 'hiragana' },
    { id: 'outfit_yukata', slot: 'outfit', labelKo: '유카타', glyph: '🌸', color: '#F4A261', unlockedBy: 'katakana' },
    { id: 'outfit_robe', slot: 'outfit', labelKo: '학자 도포', glyph: '👘', color: '#E76F51', unlockedBy: 'hanja' },
    { id: 'outfit_hanbok', slot: 'outfit', labelKo: '한복 도포', glyph: '🧵', color: '#C44536', unlockedBy: 'hanja' },
    { id: 'outfit_desert', slot: 'outfit', labelKo: '사막 외투', glyph: '🏜️', color: '#E4B363', unlockedBy: 'egyptian' },
    { id: 'outfit_kalasiris', slot: 'outfit', labelKo: '칼라시리스', glyph: '🪡', color: '#D4A24C', unlockedBy: 'egyptian' },
    { id: 'outfit_sabai', slot: 'outfit', labelKo: '사바이 의상', glyph: '🪷', color: '#9B5DE5', unlockedBy: 'thai' },
    { id: 'outfit_chut', slot: 'outfit', labelKo: '쩟타이', glyph: '🌺', color: '#7E3FAA', unlockedBy: 'thai' },
    { id: 'outfit_pirate', slot: 'outfit', labelKo: '해적 옷', glyph: '☠️', color: '#4C9AFF', unlockedBy: 'latin' },
    { id: 'outfit_suit', slot: 'outfit', labelKo: '신사 정장', glyph: '🤵', color: '#264653', unlockedBy: 'latin' },
    { id: 'outfit_tunic', slot: 'outfit', labelKo: '쐐기 튜닉', glyph: '🧥', color: '#8D6A9F', unlockedBy: 'cuneiform' },
    { id: 'outfit_lamassu', slot: 'outfit', labelKo: '라마수 망토', glyph: '🦬', color: '#B58968', unlockedBy: 'cuneiform' },
    { id: 'outfit_thawb', slot: 'outfit', labelKo: '소브 의상', glyph: '🧞', color: '#EF4444', unlockedBy: 'arabic' },
    { id: 'outfit_tallit', slot: 'outfit', labelKo: '탈리트', glyph: '🕎', color: '#10B981', unlockedBy: 'hebrew' },
    { id: 'outfit_furcloak', slot: 'outfit', labelKo: '모피 망토', glyph: '🦊', color: '#7C3AED', unlockedBy: 'rune' },
    // ─── Badges (장신구) ──────────────────────────────────
    { id: 'badge_ankh', slot: 'badge', labelKo: '앙크', glyph: '☥', color: '#E4B363', unlockedBy: 'egyptian' },
    { id: 'badge_eye', slot: 'badge', labelKo: '호루스의 눈', glyph: '𓂀', color: '#D4A24C', unlockedBy: 'egyptian' },
    { id: 'badge_alpha', slot: 'badge', labelKo: '알파', glyph: 'Α', color: '#00BBF9', unlockedBy: 'greek' },
    { id: 'badge_omega', slot: 'badge', labelKo: '오메가', glyph: 'Ω', color: '#48B0C7', unlockedBy: 'greek' },
    { id: 'badge_wen', slot: 'badge', labelKo: '글월 문', glyph: '文', color: '#E76F51', unlockedBy: 'hanja' },
    { id: 'badge_yong', slot: 'badge', labelKo: '용', glyph: '龍', color: '#C44536', unlockedBy: 'hanja' },
    { id: 'badge_sakura', slot: 'badge', labelKo: '사쿠라', glyph: '🌸', color: '#FF6B9D', unlockedBy: 'hiragana' },
    { id: 'badge_fan', slot: 'badge', labelKo: '부채', glyph: '🪭', color: '#F4A261', unlockedBy: 'hiragana' },
    { id: 'badge_torii', slot: 'badge', labelKo: '도리이', glyph: '⛩️', color: '#E76F51', unlockedBy: 'katakana' },
    { id: 'badge_koi', slot: 'badge', labelKo: '잉어', glyph: '🐟', color: '#F4A261', unlockedBy: 'katakana' },
    { id: 'badge_wedge', slot: 'badge', labelKo: '쐐기 징표', glyph: '𒀭', color: '#8D6A9F', unlockedBy: 'cuneiform' },
    { id: 'badge_lion', slot: 'badge', labelKo: '아슈르 사자', glyph: '🦁', color: '#B58968', unlockedBy: 'cuneiform' },
    { id: 'badge_lotus', slot: 'badge', labelKo: '연꽃 메달', glyph: '🪷', color: '#9B5DE5', unlockedBy: 'thai' },
    { id: 'badge_naga', slot: 'badge', labelKo: '나가', glyph: '🐉', color: '#7E3FAA', unlockedBy: 'thai' },
    { id: 'badge_compass', slot: 'badge', labelKo: '나침반', glyph: '🧭', color: '#4C9AFF', unlockedBy: 'latin' },
    { id: 'badge_anchor', slot: 'badge', labelKo: '닻', glyph: '⚓', color: '#264653', unlockedBy: 'latin' },
    { id: 'badge_crescent', slot: 'badge', labelKo: '초승달', glyph: '☪️', color: '#EF4444', unlockedBy: 'arabic' },
    { id: 'badge_star_d', slot: 'badge', labelKo: '다윗의 별', glyph: '✡️', color: '#10B981', unlockedBy: 'hebrew' },
    { id: 'badge_yggdrasil', slot: 'badge', labelKo: '세계수', glyph: '🌳', color: '#7C3AED', unlockedBy: 'rune' },
    // ─── Backgrounds ─────────────────────────────────────
    { id: 'bg_pyramid', slot: 'background', labelKo: '피라미드', glyph: '🏜️', color: '#E4B363', unlockedBy: 'egyptian' },
    { id: 'bg_nile', slot: 'background', labelKo: '나일강', glyph: '𓊃', color: '#D4A24C', unlockedBy: 'egyptian' },
    { id: 'bg_temple', slot: 'background', labelKo: '그리스 신전', glyph: '🏛️', color: '#BEE3F8', unlockedBy: 'greek' },
    { id: 'bg_aegean', slot: 'background', labelKo: '에게해', glyph: '🌊', color: '#48B0C7', unlockedBy: 'greek' },
    { id: 'bg_palace', slot: 'background', labelKo: '궁궐', glyph: '🏯', color: '#E76F51', unlockedBy: 'hanja' },
    { id: 'bg_bamboo', slot: 'background', labelKo: '대나무 숲', glyph: '🎋', color: '#7DA46B', unlockedBy: 'hanja' },
    { id: 'bg_sakurapath', slot: 'background', labelKo: '사쿠라 길', glyph: '🌸', color: '#FFB7C5', unlockedBy: 'hiragana' },
    { id: 'bg_fuji', slot: 'background', labelKo: '후지산', glyph: '🗻', color: '#F4A261', unlockedBy: 'katakana' },
    { id: 'bg_pagoda', slot: 'background', labelKo: '왓 파고다', glyph: '🛕', color: '#9B5DE5', unlockedBy: 'thai' },
    { id: 'bg_floatmkt', slot: 'background', labelKo: '수상시장', glyph: '🛶', color: '#7E3FAA', unlockedBy: 'thai' },
    { id: 'bg_ziggurat', slot: 'background', labelKo: '지구라트', glyph: '🏛️', color: '#8D6A9F', unlockedBy: 'cuneiform' },
    { id: 'bg_tablets', slot: 'background', labelKo: '점토판 서고', glyph: '📜', color: '#B58968', unlockedBy: 'cuneiform' },
    { id: 'bg_galleon', slot: 'background', labelKo: '대항해', glyph: '⛵', color: '#4C9AFF', unlockedBy: 'latin' },
    { id: 'bg_colosseum', slot: 'background', labelKo: '콜로세움', glyph: '🏟️', color: '#264653', unlockedBy: 'latin' },
    { id: 'bg_oasis', slot: 'background', labelKo: '오아시스', glyph: '🌴', color: '#EF4444', unlockedBy: 'arabic' },
    { id: 'bg_western_wall', slot: 'background', labelKo: '통곡의 벽', glyph: '🧱', color: '#10B981', unlockedBy: 'hebrew' },
    { id: 'bg_aurora', slot: 'background', labelKo: '오로라', glyph: '🌌', color: '#7C3AED', unlockedBy: 'rune' },
];
export function itemsBySlot(slot) {
    return ITEMS.filter((i) => i.slot === slot);
}
// ver23: position-based slot mapping. Position 0 → hat, 1 → outfit,
// 2 → badge, 3 → background. For 3-syllable names the background slot has no
// matching syllable, so the user gets "어떤 배경이든 고를 수 있어."
export const SLOT_BY_POSITION = ['hat', 'outfit', 'badge', 'background'];
export function itemsForScript(slot, script) {
    return ITEMS.filter((i) => i.slot === slot && i.unlockedBy === script);
}
export function unlockedItemIds(scriptIds) {
    // Backwards-compat helper. ver12 doesn't gate items by lock anymore — every
    // item is selectable — so this returns all item ids.
    void scriptIds;
    return new Set(ITEMS.map((i) => i.id));
}
export function itemById(id) {
    return id ? ITEMS.find((i) => i.id === id) : undefined;
}
