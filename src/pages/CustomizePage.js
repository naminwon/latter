import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useSession } from '../store/session';
import { itemsBySlot, itemsForScript, SLOT_BY_POSITION } from '../data/items';
import { SCRIPT_CULTURE_KO } from '../data/transliterations';
const SLOT_LABELS = [
    { slot: 'hat', label: '모자', icon: '🎩' },
    { slot: 'outfit', label: '의상', icon: '🎽' },
    { slot: 'badge', label: '장신구', icon: '✦' },
    { slot: 'background', label: '배경', icon: '🏞️' },
];
function ItemButton({ item, selected, onClick, }) {
    // ver17 size; kept compact since the picker now sits inside the right card.
    return (_jsxs(motion.button, { whileTap: { scale: 0.92 }, whileHover: { y: -2 }, onClick: onClick, className: `relative w-full h-[92px] rounded-card shadow-card flex flex-col items-center justify-center gap-0.5
                  font-display text-body transition-all
                  ${selected ? 'ring-4 ring-primary bg-white shadow-cardLg' : 'bg-white hover:shadow-cardLg'}`, style: { borderTop: `5px solid ${item.color}` }, children: [_jsx("div", { className: "text-[30px] leading-none", children: item.glyph }), _jsx("div", { className: "text-[12px] text-ink px-1 text-center leading-tight", children: item.labelKo }), selected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-2 -right-2 bg-accent text-white w-6 h-6 rounded-full grid place-items-center text-[12px]", children: "\u2713" }))] }));
}
export default function CustomizePage() {
    const nav = useNavigate();
    const { userName, picked, customization, setCustomization, finalizeTicket, gender, setGender } = useSession();
    // ver12: position → slot map (0 bg, 1 hat, 2 outfit, 3 badge).
    const slotScript = useMemo(() => {
        const map = {
            background: null, hat: null, outfit: null, badge: null,
        };
        SLOT_BY_POSITION.forEach((slot, idx) => {
            const choice = picked[idx];
            map[slot] = choice ? choice.scriptId : null;
        });
        return map;
    }, [picked]);
    // ver23: when no syllable maps to a slot (e.g. background for a 3-syllable name),
    // show ALL items — "어떤 [slot]이든 고를 수 있어." rather than a random theme.
    // ver23 follow-up: cap the background list at 8 so it doesn't get overwhelming.
    const optionsForSlot = (slot) => {
        const script = slotScript[slot];
        const all = !script || itemsForScript(slot, script).length === 0
            ? itemsBySlot(slot)
            : itemsForScript(slot, script);
        return slot === 'background' ? all.slice(0, 8) : all;
    };
    const [activeSlot, setActiveSlot] = useState('hat');
    const [justUnlockedPop, setJustUnlockedPop] = useState(null);
    // Auto-pick the first themed option per slot on mount.
    useEffect(() => {
        SLOT_LABELS.forEach(({ slot }) => {
            if (!customization[slot]) {
                const opts = optionsForSlot(slot);
                if (opts[0])
                    setCustomization(slot, opts[0].id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!userName)
            nav('/name');
    }, [userName, nav]);
    const allSlotsFilled = SLOT_LABELS.every(({ slot }) => customization[slot]);
    const handleSubmit = () => {
        finalizeTicket();
        nav('/ticket');
    };
    const options = optionsForSlot(activeSlot);
    const handlePick = (item) => {
        setCustomization(activeSlot, item.id);
        setJustUnlockedPop(item.labelKo);
        setTimeout(() => setJustUnlockedPop(null), 900);
    };
    return (_jsxs(AppShell, { stage: "customize", hint: "\uBAA8\uC790\u00B7\uC758\uC0C1\u00B7\uC7A5\uC2E0\uAD6C\u00B7\uBC30\uACBD\uC744 \uACE8\uB77C \uB108\uB9CC\uC758 \uCE90\uB9AD\uD130\uB97C \uC644\uC131\uD574\uBD10!", children: [_jsxs("div", { className: "h-full flex flex-col gap-4 px-8 py-4 overflow-y-auto", children: [_jsxs("div", { className: "h-[52px] flex items-center justify-between", children: [_jsx("h2", { className: "font-display text-h2 text-ink", children: "\uB108\uB9CC\uC758 \uCE90\uB9AD\uD130\uB97C \uAFB8\uBA70\uBD10!" }), _jsx(Button, { size: "lg", onClick: handleSubmit, disabled: !allSlotsFilled, children: "\uD2F0\uCF13 \uBCF4\uAE30 \u2192" })] }), _jsxs("div", { className: "flex-1 grid grid-cols-12 gap-5 min-h-0 mt-[10px]", children: [_jsx("section", { className: "col-span-5 flex flex-col", children: _jsxs("div", { className: "flex-1 min-h-[445px] bg-white/70 rounded-card shadow-card p-4 flex flex-col items-stretch gap-3", children: [_jsx("div", { className: "flex gap-2 bg-bgWarm rounded-pill p-1 shadow-card self-center", children: ['boy', 'girl'].map((g) => (_jsx("button", { onClick: () => setGender(g), className: `px-4 py-1.5 rounded-pill font-display text-small transition-all
                      ${gender === g ? 'bg-primary text-white shadow-card' : 'text-ink hover:bg-white/60'}`, children: g === 'boy' ? '👦 남자아이' : '👧 여자아이' }, g))) }), _jsx("div", { className: "relative flex-1 min-h-0 overflow-hidden rounded-card", children: _jsx("img", { src: gender === 'boy' ? '/assets/boy.png' : '/assets/girl.png', alt: gender === 'boy' ? '남자아이' : '여자아이', className: "absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none", draggable: false }) }), _jsx("div", { className: "flex flex-wrap justify-center gap-2 pt-1", children: picked.filter(Boolean).map((p, i) => (_jsxs("span", { className: "px-3 py-1 bg-white rounded-pill shadow-card font-display text-small text-ink", children: [_jsx("b", { className: "text-primary", children: p.syllable }), _jsx("span", { className: "text-inkSoft mx-1", children: "\u2192" }), SCRIPT_CULTURE_KO[p.scriptId]] }, i))) })] }) }), _jsx("section", { className: "col-span-7 flex flex-col", children: _jsxs("div", { className: "flex-1 min-h-[445px] bg-white/70 rounded-card shadow-card p-4 flex flex-col gap-3", children: [_jsx("div", { className: "flex gap-1 bg-bgWarm rounded-pill p-1 shadow-card self-center", children: SLOT_LABELS.map(({ slot, label, icon }) => (_jsxs("button", { onClick: () => setActiveSlot(slot), className: `px-3 py-1.5 rounded-pill font-display text-small flex items-center gap-1.5 transition-all
                      ${activeSlot === slot
                                                    ? 'bg-primary text-white shadow-card'
                                                    : 'text-ink hover:bg-white/60'}`, children: [_jsx("span", { className: "text-[18px]", children: icon }), label, customization[slot] && (_jsx("span", { className: `rounded-full w-4 h-4 grid place-items-center text-[11px]
                        ${activeSlot === slot ? 'bg-white/30 text-white' : 'bg-primary/15 text-primary'}`, children: "\u2713" }))] }, slot))) }), _jsx("div", { className: "text-center font-display text-small text-inkSoft", children: (() => {
                                                const activeLabel = SLOT_LABELS.find((s) => s.slot === activeSlot)?.label ?? '';
                                                const script = slotScript[activeSlot];
                                                return script
                                                    ? `${SCRIPT_CULTURE_KO[script]} 문화권의 ${activeLabel} 아이템을 선택할 수 있어.`
                                                    : `어떤 ${activeLabel}이든 고를 수 있어.`;
                                            })() }), _jsxs("div", { className: "flex-1 flex flex-col gap-3 min-h-0", children: [_jsx("div", { className: "flex flex-col min-h-0 mt-[5px]", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, className: "grid grid-cols-4 gap-3", children: options.map((it) => (_jsx(ItemButton, { item: it, selected: customization[activeSlot] === it.id, onClick: () => handlePick(it) }, it.id))) }, activeSlot) }) }), _jsx("div", { className: "mt-auto h-px bg-ink/15" }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: SLOT_LABELS.map(({ slot, label, icon }) => {
                                                        const id = customization[slot];
                                                        const opts = itemsBySlot(slot);
                                                        const it = id ? opts.find((o) => o.id === id) : undefined;
                                                        return (_jsxs("div", { className: "relative bg-white rounded-card shadow-card overflow-hidden", children: [_jsx("div", { className: "h-1.5 w-full", style: { background: it?.color ?? '#E5E7EB' } }), _jsxs("div", { className: "px-2 pt-1.5 pb-2 flex flex-col items-center gap-0.5", children: [_jsxs("div", { className: "flex items-center gap-1 text-inkSoft font-display text-[11px]", children: [_jsx("span", { className: "text-[12px] opacity-70", children: icon }), _jsx("span", { children: label })] }), _jsx("div", { className: "text-[28px] leading-none my-0.5", children: it?.glyph ?? '·' }), _jsx("div", { className: "font-display text-[11px] text-ink truncate max-w-full", children: it?.labelKo ?? '—' })] })] }, slot));
                                                    }) })] })] }) })] })] }), _jsx(AnimatePresence, { children: justUnlockedPop && (_jsxs(motion.div, { initial: { y: 40, opacity: 0, scale: 0.8 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: -30, opacity: 0 }, className: "fixed bottom-28 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-pill font-display text-h3 shadow-cardLg z-40", children: ["\uD83D\uDC57 ", justUnlockedPop, " \uC7A5\uCC29!"] })) })] }));
}
