import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TopBar } from './TopBar';
import { HintBar } from './HintBar';
export function AppShell({ stage, hint, showChrome = true, showBack = true, showHome = true, backDisabled = false, homeDisabled = false, onBack, rightSlot, dimChrome = false, children, }) {
    return (_jsxs("div", { className: "min-h-screen flex flex-col paper-bg", children: [showChrome && _jsx(TopBar, { currentStage: stage, dim: dimChrome }), _jsx("main", { className: "flex-1 relative overflow-hidden", children: children }), showChrome && (_jsx(HintBar, { hint: hint, showBack: showBack, showHome: showHome, backDisabled: backDisabled, homeDisabled: homeDisabled, onBack: onBack, rightSlot: rightSlot }))] }));
}
