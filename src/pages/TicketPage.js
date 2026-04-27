import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useSession } from '../store/session';
import { SCRIPT_COLOR, SCRIPT_LABEL_KO } from '../data/transliterations';
import { itemById } from '../data/items';
const SLOT_ORDER = [
    { slot: 'hat', label: '모자' },
    { slot: 'outfit', label: '의상' },
    { slot: 'badge', label: '장신구' },
    { slot: 'background', label: '배경' },
];
export default function TicketPage() {
    const nav = useNavigate();
    const { ticket, userName, gender } = useSession();
    useEffect(() => {
        if (!ticket)
            nav('/customize');
    }, [ticket, nav]);
    if (!ticket)
        return null;
    const qrPayload = `letterland://ticket/${ticket.id}?name=${encodeURIComponent(userName)}`;
    return (_jsx(AppShell, { stage: "ticket", hint: "\uD83D\uDCA1 QR\uC744 \uCC0D\uC5B4\uC11C \uC5C4\uB9C8\u00B7\uC544\uBE60 \uD3F0\uC5D0 \uC800\uC7A5\uD560 \uC218 \uC788\uC5B4!", children: _jsxs("div", { className: "h-full flex flex-col items-center justify-center px-8 py-4 gap-4", children: [_jsxs(motion.h1, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "font-display text-h2 text-ink", children: ["\uD83C\uDF89 ", userName, "\uC758 \uC785\uC7A5\uAD8C\uC774 \uB098\uC654\uC5B4! \uD83C\uDF89"] }), _jsxs(motion.article, { initial: { y: 200, rotate: -1, opacity: 0 }, animate: { y: 0, rotate: 0, opacity: 1 }, transition: { type: 'spring', stiffness: 80, damping: 14 }, className: "relative w-[1100px] max-w-[95vw] bg-bgPaper rounded-card shadow-cardLg overflow-hidden\n                     grid grid-cols-[280px_1fr_200px] gap-6 p-6", children: [_jsx("div", { className: "absolute inset-0 card-stripe opacity-60 pointer-events-none" }), _jsxs("div", { className: "relative z-10 flex flex-col items-center justify-between", children: [_jsx("div", { className: "relative w-full h-[260px] overflow-hidden rounded-card", children: _jsx("img", { src: gender === 'boy' ? '/assets/boy.png' : '/assets/girl.png', alt: gender === 'boy' ? '남자아이' : '여자아이', className: "absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none", draggable: false }) }), _jsx("div", { className: "mt-3 grid grid-cols-4 gap-2 w-full", children: SLOT_ORDER.map(({ slot, label }) => {
                                        const it = itemById(ticket.customization[slot]);
                                        return (_jsxs("div", { className: "bg-white rounded-card shadow-card flex flex-col items-center py-1.5", style: it ? { borderTop: `3px solid ${it.color}` } : {}, children: [_jsx("span", { className: "text-[24px] leading-none", children: it?.glyph ?? '·' }), _jsx("span", { className: "font-display text-[10px] text-inkSoft mt-0.5", children: label })] }, slot));
                                    }) })] }), _jsxs("section", { className: "relative z-10 flex flex-col text-center", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("h2", { className: "font-display text-h2 text-ink", children: "\u2726 \uBB38\uC790\uB098\uB77C \uC785\uC7A5\uAD8C \u2726" }), _jsx("p", { className: "font-display text-small text-inkSoft tracking-wider mt-1", children: "LETTER LAND TICKET" })] }), _jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("div", { className: "flex gap-5", children: ticket.syllableMap.map((p, i) => (_jsxs("div", { className: "flex flex-col items-center min-w-[80px]", children: [_jsx("span", { className: "font-display text-[32px] text-inkSoft leading-none", children: p.syllable }), _jsx("span", { className: "text-[20px] text-inkSoft my-1", children: "\u25BC" }), _jsx("span", { className: "font-display text-[64px] leading-none", style: { color: SCRIPT_COLOR[p.scriptId] }, children: p.text }), _jsx("span", { className: "text-small text-inkSoft mt-1", children: SCRIPT_LABEL_KO[p.scriptId] })] }, i))) }) }), _jsxs("div", { className: "font-display text-small text-inkSoft mt-2 whitespace-nowrap", children: ["\uAD6D\uB9BD\uC138\uACC4\uBB38\uC790\uBC15\uBB3C\uAD00 \u00B7 ", new Date(ticket.issuedAt).toLocaleDateString('ko-KR'), " \u00B7 No.", ticket.id] })] }), _jsx("div", { className: "relative z-10 flex items-center justify-center", children: _jsx("div", { className: "bg-white p-3 rounded-card shadow-card", children: _jsx(QRCodeSVG, { value: qrPayload, size: 170 }) }) }), _jsx("div", { className: "absolute top-6 bottom-6 left-[316px] w-0 border-l-2 border-dashed border-ink/20" }), _jsx("div", { className: "absolute top-6 bottom-6 right-[236px] w-0 border-l-2 border-dashed border-ink/20" })] }), _jsx("div", { className: "flex gap-4", children: _jsx(Button, { size: "lg", onClick: () => window.print(), children: "\uD83D\uDDA8 \uC778\uC1C4\uD558\uAE30" }) })] }) }));
}
