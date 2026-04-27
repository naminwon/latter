import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const MEDIALS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
function combine(ini, med, fin = '') {
    const iIdx = INITIALS.indexOf(ini);
    const mIdx = MEDIALS.indexOf(med);
    const fIdx = FINALS.indexOf(fin);
    if (iIdx < 0 || mIdx < 0)
        return ini + med + fin;
    const code = 0xac00 + iIdx * 588 + mIdx * 28 + fIdx;
    return String.fromCodePoint(code);
}
const ROWS = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
];
// Shift map: pressing Shift changes certain keys to their double/ya version.
const SHIFT_MAP = {
    ㄱ: 'ㄲ', ㄷ: 'ㄸ', ㅂ: 'ㅃ', ㅅ: 'ㅆ', ㅈ: 'ㅉ',
    ㅐ: 'ㅒ', ㅔ: 'ㅖ',
};
function smartAppend(prev, jamo) {
    if (!prev)
        return jamo;
    const last = prev[prev.length - 1];
    const rest = prev.slice(0, -1);
    const lastCode = last.codePointAt(0) ?? 0;
    if (lastCode >= 0xac00 && lastCode <= 0xd7a3) {
        const syllableIdx = lastCode - 0xac00;
        const iIdx = Math.floor(syllableIdx / 588);
        const mIdx = Math.floor((syllableIdx % 588) / 28);
        const fIdx = syllableIdx % 28;
        if (fIdx === 0 && FINALS.includes(jamo)) {
            return rest + combine(INITIALS[iIdx], MEDIALS[mIdx], jamo);
        }
        if (fIdx > 0 && MEDIALS.includes(jamo) && INITIALS.includes(FINALS[fIdx])) {
            const movedInitial = FINALS[fIdx];
            const stripped = combine(INITIALS[iIdx], MEDIALS[mIdx], '');
            return rest + stripped + combine(movedInitial, jamo);
        }
    }
    if (INITIALS.includes(last) && MEDIALS.includes(jamo)) {
        return rest + combine(last, jamo);
    }
    return prev + jamo;
}
function smartBackspace(prev) {
    if (!prev)
        return prev;
    const last = prev[prev.length - 1];
    const rest = prev.slice(0, -1);
    const lastCode = last.codePointAt(0) ?? 0;
    if (lastCode >= 0xac00 && lastCode <= 0xd7a3) {
        const syllableIdx = lastCode - 0xac00;
        const iIdx = Math.floor(syllableIdx / 588);
        const mIdx = Math.floor((syllableIdx % 588) / 28);
        const fIdx = syllableIdx % 28;
        if (fIdx > 0)
            return rest + combine(INITIALS[iIdx], MEDIALS[mIdx], '');
        return rest + INITIALS[iIdx];
    }
    return rest;
}
const IS_CONSONANT = new Set(INITIALS);
const IS_VOWEL = new Set(MEDIALS);
export function VirtualKeyboard({ value, onChange, maxLen = 14, className = '' }) {
    const [shift, setShift] = useState(false);
    const press = (jamo) => {
        const mapped = shift && SHIFT_MAP[jamo] ? SHIFT_MAP[jamo] : jamo;
        const next = smartAppend(value, mapped);
        if (Array.from(next).length <= maxLen)
            onChange(next);
        if (shift)
            setShift(false);
    };
    const back = () => onChange(smartBackspace(value));
    return (_jsxs("div", { className: `select-none w-full ${className}`, children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-2 font-display text-small text-inkSoft", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-secondary inline-block" }), " \uC790\uC74C"] }), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-accent inline-block" }), " \uBAA8\uC74C"] }), shift && (_jsx("span", { className: "inline-flex items-center gap-1 text-primary font-bold", children: "\u21E7 \uC26C\uD504\uD2B8 \uCF1C\uC9D0 (\uC30D\uC790\uC74C/\uACB9\uBAA8\uC74C)" }))] }), _jsx("div", { className: "flex flex-col items-center gap-[6px]", children: ROWS.map((row, ri) => (_jsxs("div", { className: "flex gap-[6px] justify-center items-center", children: [ri === 2 && (_jsx(motion.button, { whileTap: { scale: 0.9 }, onClick: () => setShift((s) => !s), className: `h-[48px] w-[48px] rounded-lg shadow-card font-display text-[22px]
                            grid place-items-center
                            ${shift ? 'bg-primary text-white' : 'bg-white text-ink hover:bg-bgWarm'}`, "aria-label": "\uC26C\uD504\uD2B8", "aria-pressed": shift, children: "\u21E7" })), row.map((k) => {
                            const isVowel = IS_VOWEL.has(k);
                            const isCon = IS_CONSONANT.has(k);
                            const display = shift && SHIFT_MAP[k] ? SHIFT_MAP[k] : k;
                            const color = isVowel
                                ? 'bg-accent/15 text-accent hover:bg-accent/25'
                                : isCon
                                    ? 'bg-secondary/15 text-secondary hover:bg-secondary/25'
                                    : 'bg-white text-ink hover:bg-bgWarm';
                            return (_jsx(motion.button, { whileTap: { scale: 0.9 }, onClick: () => press(k), className: `w-[44px] h-[48px] rounded-lg shadow-card font-display text-[22px]
                              grid place-items-center ${color}`, children: display }, k));
                        }), ri === 2 && (_jsx(motion.button, { whileTap: { scale: 0.9 }, onClick: back, className: "h-[48px] w-[48px] rounded-lg bg-danger/90 text-white shadow-card\n                           font-display text-[22px] grid place-items-center", "aria-label": "\uC9C0\uC6B0\uAE30", children: "\u232B" }))] }, ri))) })] }));
}
