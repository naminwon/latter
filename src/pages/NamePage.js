import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Papi } from '../components/Papi';
import { SpeechBubble } from '../components/SpeechBubble';
import { Button } from '../components/Button';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { useSession } from '../store/session';
const EMOJI_NAMES = [
    { label: '고양이', emoji: '🐱', name: '고양이' },
    { label: '토끼', emoji: '🐰', name: '토끼' },
    { label: '여우', emoji: '🦊', name: '여우' },
    { label: '판다', emoji: '🐼', name: '판다' },
    { label: '사자', emoji: '🦁', name: '사자' },
    { label: '개구리', emoji: '🐸', name: '개구리' },
];
export default function NamePage() {
    const nav = useNavigate();
    const setUserName = useSession((s) => s.setUserName);
    const [mode, setMode] = useState('idle');
    const [typed, setTyped] = useState('');
    const [heard, setHeard] = useState('');
    const [cameFromConfirm, setCameFromConfirm] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const startRecording = () => {
        setMode('recording');
        setTimeout(() => {
            setHeard('나민원');
            setMode('confirm');
        }, 1500);
    };
    const commit = (name) => {
        setUserName(name);
        nav('/scripts');
    };
    const bubbleText = mode === 'idle' ? '네 이름을 알고 싶어.\n마이크를 눌러서 이름을 말해줘.' :
        mode === 'recording' ? '듣고 있어... 🎧' :
            mode === 'confirm' ? `이름이 "${heard}"이구나!` :
                mode === 'keyboard' ? (cameFromConfirm
                    ? '내가 잘 못 들었나봐.\n키보드를 눌러서 이름을 입력해줘!'
                    : '키보드를 눌러서 이름을 입력해줘!') :
                    '이름을 말하기 부끄럽다면 좋아하는 동물을 선택해 보자!';
    const footerHint = mode === 'recording' ? '너의 이름을 듣고 있어' :
        mode === 'confirm' ? '이름이 틀렸다면 직접 수정하자' :
            mode === 'keyboard' ? '키보드로 이름을 입력해 보자' :
                mode === 'emoji' ? '좋아하는 동물을 골라보자' :
                    '부끄러우면 "동물 이름"을 선택해 보자';
    // Back button: any sub-mode returns to the mic (idle) screen in-page.
    // Only from idle does "뒤로" leave the name page (default nav(-1)).
    const onBack = mode !== 'idle'
        ? () => { setMode('idle'); setCameFromConfirm(false); }
        : undefined;
    useEffect(() => {
        if (mode !== 'emoji')
            setPickedEmoji(null);
    }, [mode]);
    // Panels are raised higher in keyboard/emoji to keep the footer visible.
    const rightPt = (mode === 'keyboard' || mode === 'emoji') ? 'pt-8' : 'pt-32';
    return (_jsx(AppShell, { stage: "name", hint: footerHint, onBack: onBack, children: _jsxs("div", { className: "h-full grid grid-cols-12 gap-8 items-start px-12 py-6", children: [_jsxs("div", { className: "col-span-6 flex items-center gap-6 pt-16", children: [_jsx(Papi, { size: 340, mood: mode === 'recording' ? 'thinking' : 'talking', showItems: false }), _jsx(SpeechBubble, { text: bubbleText, size: "lg", tail: "left", typing: true, className: "w-[460px] min-h-[200px]" })] }), _jsx("div", { className: `col-span-6 flex flex-col items-center gap-6 ${rightPt}`, children: _jsxs(AnimatePresence, { mode: "wait", children: [mode === 'idle' && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 }, className: "flex flex-col items-center gap-4", children: [_jsxs("div", { className: "relative -translate-y-5", children: [_jsx(motion.button, { onClick: startRecording, whileTap: { scale: 0.92 }, className: "w-[260px] h-[260px] rounded-full bg-primary text-white text-[112px]\n                               shadow-cardLg grid place-items-center", children: "\uD83C\uDFA4" }), _jsx(motion.div, { className: "absolute -inset-3 rounded-full border-4 border-primary/50 pointer-events-none", animate: { scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }, transition: { duration: 1.4, repeat: Infinity } })] }), _jsx("p", { className: "font-display text-h3 text-inkSoft", children: "\u25B6 \uB9C8\uC774\uD06C\uB97C \uB204\uB974\uACE0 \uB9D0\uD574\uBD10" }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { variant: "secondary", size: "lg", onClick: () => { setTyped(''); setCameFromConfirm(false); setMode('keyboard'); }, children: "\u2328 \uC9C1\uC811 \uC785\uB825" }), _jsx(Button, { variant: "secondary", size: "lg", onClick: () => setMode('emoji'), children: "\uD83D\uDC31 \uB3D9\uBB3C \uC774\uB984" })] })] }, "idle")), mode === 'recording' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "flex flex-col items-center gap-4", children: [_jsx(motion.div, { className: "w-[260px] h-[260px] rounded-full bg-danger/90 text-white text-[112px] grid place-items-center shadow-cardLg", animate: { scale: [1, 1.06, 1] }, transition: { duration: 0.6, repeat: Infinity }, children: "\uD83C\uDFA4" }), _jsx("p", { className: "font-display text-h3 text-danger", children: "\u25CF REC" })] }, "rec")), mode === 'confirm' && (_jsxs(motion.div, { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { opacity: 0 }, className: "bg-white rounded-card shadow-cardLg p-10 w-[520px] text-center", children: [_jsx("p", { className: "font-display text-[36px] text-ink mb-2", children: "\uB124 \uC774\uB984\uC774" }), _jsxs("p", { className: "font-display text-[56px] text-primary mb-6", children: ["\"", heard, "\""] }), _jsx("p", { className: "font-display text-[28px] text-ink mb-8", children: "\uB9DE\uC544?" }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsxs(Button, { variant: "secondary", size: "lg", onClick: () => { setTyped(heard); setCameFromConfirm(true); setMode('keyboard'); }, children: ["\uD83D\uDE45 \uC544\uB2C8\uC57C!", _jsx("br", {}), "\uC218\uC815\uD560\uAC8C"] }), _jsx(Button, { size: "lg", onClick: () => commit(heard), children: "\u2705 \uB9DE\uC544!" })] })] }, "confirm")), mode === 'keyboard' && (_jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "bg-white rounded-card shadow-cardLg p-6 w-[580px]", children: [_jsx("p", { className: "font-display text-h3 text-ink mb-3 text-center", children: "\uC774\uB984\uC744 \uC785\uB825\uD574 \uC918!" }), _jsxs("div", { className: "w-full min-h-[88px] text-center font-display text-[44px] text-ink\n                             py-4 rounded-card bg-bgWarm flex items-center justify-center", children: [typed || _jsx("span", { className: "text-inkSoft/60", children: "\uC608) \uB098\uBBFC\uC6D0" }), _jsx(motion.span, { animate: { opacity: [1, 0, 1] }, transition: { duration: 1, repeat: Infinity }, className: "ml-1 inline-block w-[3px] h-[40px] bg-ink align-middle" })] }), _jsx("div", { className: "mt-5 flex justify-center", children: _jsx(VirtualKeyboard, { value: typed, onChange: setTyped, maxLen: 14 }) }), _jsx("div", { className: "flex justify-center mt-6", children: _jsx(Button, { size: "lg", onClick: () => typed.trim() && commit(typed.trim()), children: "\uB9CC\uB4E4\uAE30 \u2192" }) })] }, "kb")), mode === 'emoji' && (_jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "bg-white rounded-card shadow-cardLg p-6 w-[560px]", children: [_jsx("p", { className: "font-display text-h3 text-ink mb-4 text-center", children: "\uC5B4\uB5A4 \uB3D9\uBB3C\uB85C \uD560\uAE4C?" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: EMOJI_NAMES.map((e) => (_jsxs(motion.button, { whileTap: { scale: 0.94 }, onClick: () => setPickedEmoji(e), className: `h-[110px] rounded-card shadow-card grid place-items-center transition-all
                        ${pickedEmoji?.name === e.name
                                                ? 'bg-primary/15 ring-4 ring-primary'
                                                : 'bg-bgWarm hover:bg-white'}`, children: [_jsx("div", { className: "text-[44px] leading-none", children: e.emoji }), _jsx("div", { className: "font-display text-body text-ink", children: e.label })] }, e.name))) }), _jsx("div", { className: "flex justify-center mt-6", children: _jsx(Button, { size: "lg", disabled: !pickedEmoji, onClick: () => pickedEmoji && commit(pickedEmoji.name), children: "\uB9CC\uB4E4\uAE30 \u2192" }) })] }, "emo"))] }) })] }) }));
}
