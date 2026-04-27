import React from 'react';
import { motion } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg' | 'xl';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}: Props) {
  const v =
    variant === 'primary'
      ? 'bg-primary text-white shadow-card hover:brightness-105'
      : variant === 'secondary'
        ? 'bg-white text-ink shadow-card hover:bg-bgWarm'
        : 'bg-transparent text-inkSoft hover:bg-white/60';
  const s =
    size === 'xl'
      ? 'min-w-[280px] h-[96px] px-10 text-[28px] rounded-card'
      : size === 'lg'
        ? 'min-w-[200px] h-[72px] px-8 text-[22px] rounded-card'
        : 'h-[56px] px-6 text-body rounded-pill';

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.12 }}
      className={`font-display inline-flex items-center justify-center gap-2 ${v} ${s} ${className}`}
      {...(rest as any)}
    >
      {icon && <span className="text-[1.2em]">{icon}</span>}
      {children}
    </motion.button>
  );
}
