import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Papi } from '../components/Papi';
import { SpeechBubble } from '../components/SpeechBubble';
import { Button } from '../components/Button';
export default function IntroPage() {
    const nav = useNavigate();
    const [ctaVisible, setCtaVisible] = useState(false);
    return (_jsx(AppShell, { stage: "intro", hint: "\uC785\uC7A5\uAD8C\uC744 \uB9CC\uB4E4\uC5B4\uBCF4\uC790 \uD83D\uDE0A", showBack: false, children: _jsxs("div", { className: "h-full grid grid-cols-12 gap-6 items-center px-12 py-8", children: [_jsx("div", { className: "col-span-5 flex justify-center", children: _jsx(Papi, { size: 420, mood: "talking", showItems: false }) }), _jsxs("div", { className: "col-span-7 flex flex-col items-start gap-6", children: [_jsx(SpeechBubble, { text: `안녕, 나는 문자 나라 지킴이 파피야!\n문자 나라에 들어가려면 입장권이 필요해.\n나랑 같이 입장권을 만들어 볼래? 🎟️`, size: "lg", tail: "left", onFinish: () => setCtaVisible(true) }), _jsx(AnimatePresence, { children: ctaVisible && (_jsx(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { opacity: 0 }, className: "flex flex-col items-start gap-4", children: _jsx(Button, { size: "xl", onClick: () => nav('/name'), children: "\uC2DC\uC791\uD558\uAE30 \u2192" }) }, "cta-group")) })] })] }) }));
}
