// Split a Korean string into syllable characters.
// Each 한글 완성형 syllable (AC00-D7A3) is one entry.
// Non-Hangul chars pass through as-is (useful for names with spaces/English).
export function splitHangulSyllables(name) {
    return Array.from(name.trim()).filter((c) => c.trim().length > 0);
}
export function isHangul(ch) {
    const code = ch.codePointAt(0) ?? 0;
    return code >= 0xac00 && code <= 0xd7a3;
}
