import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
export function SpeechBubble({ text, typing = true, onFinish, tail = 'left', size = 'md', className = '' }) {
    const [shown, setShown] = useState(typing ? '' : text);
    const onFinishRef = useRef(onFinish);
    onFinishRef.current = onFinish;
    useEffect(() => {
        if (!typing) {
            setShown(text);
            return;
        }
        setShown('');
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setShown(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
                setTimeout(() => onFinishRef.current?.(), 400);
            }
        }, 35);
        return () => clearInterval(id);
    }, [text, typing]);
    const sizeCls = size === 'sm' ? 'text-[20px] px-5 py-3' :
        size === 'lg' ? 'text-[32px] px-8 py-6' :
            'text-[24px] px-6 py-4';
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: `relative bg-white/95 text-ink rounded-card shadow-card
                  leading-snug font-display max-w-[620px] ${sizeCls} ${className}`, children: [_jsx("span", { className: "whitespace-pre-line", children: shown }), tail === 'left' && (_jsx("div", { className: "absolute left-[-12px] top-1/2 -translate-y-1/2 w-0 h-0\n                        border-t-[12px] border-t-transparent\n                        border-b-[12px] border-b-transparent\n                        border-r-[16px] border-r-white/95" })), tail === 'right' && (_jsx("div", { className: "absolute right-[-12px] top-1/2 -translate-y-1/2 w-0 h-0\n                        border-t-[12px] border-t-transparent\n                        border-b-[12px] border-b-transparent\n                        border-l-[16px] border-l-white/95" })), tail === 'bottom' && (_jsx("div", { className: "absolute bottom-[-12px] left-10 w-0 h-0\n                        border-l-[12px] border-l-transparent\n                        border-r-[12px] border-r-transparent\n                        border-t-[16px] border-t-white/95" }))] }));
}
