import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
export function HintBar({ hint, showBack = true, showHome = true, backDisabled = false, homeDisabled = false, onBack, rightSlot, }) {
    const nav = useNavigate();
    const goBack = () => { if (onBack)
        onBack();
    else
        nav(-1); };
    const goHome = () => {
        // ver15: just navigate. AttractPage performs the reset on mount, which
        // avoids the race with per-page guards (e.g., ScriptsPage's `!userName -> /name`).
        nav('/');
    };
    const backDimClass = backDisabled
        ? 'opacity-40 cursor-not-allowed pointer-events-none'
        : 'hover:bg-white';
    const homeDimClass = homeDisabled
        ? 'opacity-40 cursor-not-allowed pointer-events-none'
        : 'hover:bg-white';
    return (_jsxs("footer", { className: "h-[72px] px-12 flex items-center justify-between bg-bgWarm/80 backdrop-blur border-t border-ink/5", children: [_jsxs("div", { className: "w-[260px] flex items-center gap-3", children: [showBack && (_jsx("button", { onClick: goBack, disabled: backDisabled, "aria-disabled": backDisabled, className: `flex items-center gap-2 px-4 h-[48px] rounded-pill bg-white/80 shadow-card text-ink font-display text-body ${backDimClass}`, children: "\u2190 \uB4A4\uB85C" })), showHome && (_jsx("button", { onClick: goHome, disabled: homeDisabled, "aria-disabled": homeDisabled, className: `flex items-center gap-2 px-4 h-[48px] rounded-pill bg-white/80 shadow-card text-ink font-display text-body ${homeDimClass}`, children: "\uD83C\uDFE0 \uCC98\uC74C\uC73C\uB85C" }))] }), _jsx("div", { className: "flex-1 text-center text-inkSoft font-display text-body", children: hint ?? '' }), _jsx("div", { className: "w-[260px] flex items-center justify-end gap-3", children: rightSlot })] }));
}
