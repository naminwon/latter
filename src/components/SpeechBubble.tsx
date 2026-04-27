import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  text: string;
  typing?: boolean;
  onFinish?: () => void;
  tail?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SpeechBubble({ text, typing = true, onFinish, tail = 'left', size = 'md', className = '' }: Props) {
  const [shown, setShown] = useState(typing ? '' : text);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (!typing) { setShown(text); return; }
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

  const sizeCls =
    size === 'sm' ? 'text-[20px] px-5 py-3' :
    size === 'lg' ? 'text-[32px] px-8 py-6' :
                    'text-[24px] px-6 py-4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white/95 text-ink rounded-card shadow-card
                  leading-snug font-display max-w-[620px] ${sizeCls} ${className}`}
    >
      <span className="whitespace-pre-line">{shown}</span>
      {/* ver17: tails vertically centered so short single-line bubbles still look correct. */}
      {tail === 'left' && (
        <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-0 h-0
                        border-t-[12px] border-t-transparent
                        border-b-[12px] border-b-transparent
                        border-r-[16px] border-r-white/95" />
      )}
      {tail === 'right' && (
        <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-0 h-0
                        border-t-[12px] border-t-transparent
                        border-b-[12px] border-b-transparent
                        border-l-[16px] border-l-white/95" />
      )}
      {tail === 'bottom' && (
        <div className="absolute bottom-[-12px] left-10 w-0 h-0
                        border-l-[12px] border-l-transparent
                        border-r-[12px] border-r-transparent
                        border-t-[16px] border-t-white/95" />
      )}
    </motion.div>
  );
}
