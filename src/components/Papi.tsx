import { motion } from 'framer-motion';
import type { Customization } from '../types';
import { itemById } from '../data/items';

type Mood = 'idle' | 'talking' | 'happy' | 'thinking' | 'waving';

interface Props {
  size?: number;
  mood?: Mood;
  customization?: Customization;
  showItems?: boolean;
  // ver16: when true, skip the idle/talking pulse loop entirely (used in modals).
  still?: boolean;
  className?: string;
}

// The Papi character. The base PNG is the Papi scroll character with hat.
// When `customization` is provided, we layer additional glyph badges around the
// character to indicate dress-up choices (kids see an immediate visual result).
export function Papi({
  size = 280,
  mood = 'idle',
  customization,
  showItems = true,
  still = false,
  className = '',
}: Props) {
  const hat = itemById(customization?.hat);
  const outfit = itemById(customization?.outfit);
  const badge = itemById(customization?.badge);
  const bg = itemById(customization?.background);

  const anim =
    mood === 'talking' ? { y: [0, -4, 0] } :
    mood === 'happy'   ? { y: [0, -18, 0], rotate: [-3, 3, 0] } :
    mood === 'thinking'? { rotate: [-2, 2, -2] } :
    mood === 'waving'  ? { rotate: [-3, 3, -3] } :
                         { scale: [1, 1.03, 1] };

  const dur =
    mood === 'happy' ? 0.6 :
    mood === 'talking' ? 0.35 :
    mood === 'waving' ? 0.5 :
    2.4;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {showItems && bg && (
        <div
          className="absolute inset-0 rounded-full opacity-70 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${bg.color}55 0%, ${bg.color}22 60%, transparent 80%)`,
            filter: 'blur(2px)',
          }}
        />
      )}

      <motion.img
        src="/assets/papi.png"
        alt="파피"
        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xl"
        animate={still ? undefined : anim}
        transition={still ? undefined : { duration: dur, repeat: Infinity, ease: 'easeInOut' }}
        draggable={false}
      />

      {showItems && hat && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{
            top: size * 0.02,
            width: size * 0.36,
            height: size * 0.36,
            background: `${hat.color}ee`,
            borderRadius: '50% 50% 30% 30%',
            boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
            fontSize: size * 0.22,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        >
          <span>{hat.glyph}</span>
        </motion.div>
      )}

      {showItems && outfit && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{
            bottom: size * 0.08,
            width: size * 0.42,
            height: size * 0.22,
            background: `${outfit.color}cc`,
            borderRadius: 16,
            boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
            fontSize: size * 0.14,
            color: 'white',
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <span>{outfit.glyph}</span>
        </motion.div>
      )}

      {showItems && badge && (
        <motion.div
          className="absolute flex items-center justify-center font-display"
          style={{
            right: size * 0.02,
            top: size * 0.28,
            width: size * 0.22,
            height: size * 0.22,
            background: badge.color,
            borderRadius: '50%',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            fontSize: size * 0.12,
            color: '#2E2A4A',
          }}
          initial={{ scale: 0, rotate: -60 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        >
          <span>{badge.glyph}</span>
        </motion.div>
      )}
    </div>
  );
}
