import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Papi } from '../components/Papi';
import { useSession } from '../store/session';
const FLOATING_GLYPHS = ['𓂀', 'Α', '漢', 'ナ', '𒈾', 'ก', 'A', 'Ω', '文', '🌟'];
export default function AttractPage() {
    const nav = useNavigate();
    const start = useSession((s) => s.startSession);
    const reset = useSession((s) => s.reset);
    // ver15: reset session on mount so 처음으로 lands here clean — without
    // racing the per-page guards (e.g., ScriptsPage's `!userName -> /name`).
    useEffect(() => { reset(); }, [reset]);
    const handleTouch = () => {
        start();
        nav('/intro');
    };
    return (_jsxs("div", { onPointerDown: handleTouch, className: "min-h-screen paper-bg relative overflow-hidden cursor-pointer flex flex-col items-center justify-center", children: [FLOATING_GLYPHS.map((g, i) => (_jsx(motion.span, { className: "absolute font-display text-ink/25 select-none pointer-events-none", style: {
                    fontSize: 48 + (i % 3) * 20,
                    left: `${(i * 87) % 100}%`,
                    top: `${(i * 53) % 80 + 5}%`,
                }, animate: {
                    y: [0, -20, 0],
                    rotate: [0, 8, -8, 0],
                    opacity: [0.3, 0.55, 0.3],
                }, transition: { duration: 6 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }, children: g }, i))), _jsx(motion.h1, { className: "font-display text-[80px] text-ink text-center drop-shadow-sm", initial: { y: -30, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.8 }, children: "\u2728 \uBB38\uC790 \uB098\uB77C \uD2F0\uCF13\uBC15\uC2A4 \u2728" }), _jsx(motion.div, { animate: { y: [0, -10, 0] }, transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }, className: "mt-6", children: _jsx(Papi, { size: 420, mood: "waving", showItems: false }) }), _jsx(motion.p, { className: "font-display text-[40px] text-primary mt-6", animate: { scale: [1, 1.05, 1] }, transition: { duration: 1.2, repeat: Infinity }, children: "\u25B6 \uD654\uBA74\uC744 \uD130\uCE58\uD574\uC11C \uC2DC\uC791! \uD83D\uDC46" })] }));
}
