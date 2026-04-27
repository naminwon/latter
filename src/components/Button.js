import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }) {
    const v = variant === 'primary'
        ? 'bg-primary text-white shadow-card hover:brightness-105'
        : variant === 'secondary'
            ? 'bg-white text-ink shadow-card hover:bg-bgWarm'
            : 'bg-transparent text-inkSoft hover:bg-white/60';
    const s = size === 'xl'
        ? 'min-w-[280px] h-[96px] px-10 text-[28px] rounded-card'
        : size === 'lg'
            ? 'min-w-[200px] h-[72px] px-8 text-[22px] rounded-card'
            : 'h-[56px] px-6 text-body rounded-pill';
    return (_jsxs(motion.button, { whileTap: { scale: 0.96 }, whileHover: { y: -2 }, transition: { duration: 0.12 }, className: `font-display inline-flex items-center justify-center gap-2 ${v} ${s} ${className}`, ...rest, children: [icon && _jsx("span", { className: "text-[1.2em]", children: icon }), children] }));
}
