import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { Papi } from '../components/Papi';
import { SpeechBubble } from '../components/SpeechBubble';
import { useSession } from '../store/session';
import { SCRIPT_COLOR, SCRIPT_LABEL_KO, getFunExtrasFor } from '../data/transliterations';
import type { Candidate } from '../types';

export default function ScriptsPage() {
  const nav = useNavigate();
  // ver11: stars/score no longer surfaced on this page.
  const {
    userName, syllables, activeIndex, candidates, picked,
    pickFor, setActiveIndex, unpick,
  } = useSession();

  // ver11: replaced numeric score popups with orbiting-star FX around the click point.
  const [orbits, setOrbits] = useState<{ id: number; x: number; y: number }[]>([]);
  const orbitId = useRef(0);

  // ver09: cloud-cover visual on extras. ver10: 꽝(dud) removed — every card picks.
  // First click on a covered card just reveals; second click picks normally.
  const [revealedClouds, setRevealedClouds] = useState<Set<string>>(new Set());
  useEffect(() => {
    setRevealedClouds(new Set());
  }, [activeIndex]);

  // If we navigated here without a name, send back
  useEffect(() => {
    if (!userName) nav('/name');
  }, [userName, nav]);

  const isComplete = picked.length > 0 && picked.every(Boolean);

  const current = candidates[activeIndex] ?? [];
  const availableCurrent = useMemo(
    () => current.filter((c) => picked[activeIndex]?.scriptId !== c.scriptId),
    [current, picked, activeIndex],
  );

  // ver10: extras share Candidate type and pick into the slot like main cards.
  const extras = useMemo(() => {
    const syl = syllables[activeIndex];
    if (!syl) return [] as Candidate[];
    return getFunExtrasFor(syl, activeIndex * 100);
  }, [syllables, activeIndex]);

  const availableExtras = useMemo(
    () => extras.filter((c) => picked[activeIndex]?.scriptId !== c.scriptId),
    [extras, picked, activeIndex],
  );

  const handlePick = (c: Candidate, e?: React.MouseEvent) => {
    const point = { x: e?.clientX ?? window.innerWidth / 2, y: e?.clientY ?? window.innerHeight / 2 };
    const id = ++orbitId.current;
    setOrbits((o) => [...o, { id, x: point.x, y: point.y }]);
    setTimeout(() => setOrbits((o) => o.filter((x) => x.id !== id)), 1300);
    pickFor(activeIndex, c);
  };

  // ver11: 꽝 (the first cloud-covered extra) — empty card. Click after reveal removes it.
  const [removedDuds, setRemovedDuds] = useState<Set<string>>(new Set());
  useEffect(() => { setRemovedDuds(new Set()); }, [activeIndex]);

  // ver15: intro modal shown once on entering /scripts. Dismiss with "이름 바꾸기 →".
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AppShell
      stage="scripts"
      // ver11: hint copy reworded; trailing arrow removed on completion.
      hint={isComplete ? '완성! 이제 캐릭터를 꾸며보자' : `모두 ★"${syllables[activeIndex] ?? ''}"★와 같은 소리를 내는 글자야. 마음에 드는 것을 잡아줘!`}
      // ver15/16: disable BOTH 뒤로 and 처음으로 while either modal (intro/완성) is open.
      backDisabled={isComplete || showIntro}
      homeDisabled={isComplete || showIntro}
    >
      {/* ver09: top-right score/stars and top-left Papi+name removed */}

      {/* Floating cards layer — left & right bands only (center is reserved for name/slots).
          ver09: raised to z-20 so any card click reliably picks (was being intercepted by center). */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence mode="popLayout">
          {!isComplete && availableCurrent.map((c, i) => {
            // Split cards: alternating left/right bands. Left = 2..22%, Right = 76..96%.
            const onLeft = i % 2 === 0;
            const leftBase = onLeft ? 2 + ((c.seed * 13) % 18) : 76 + ((c.seed * 11) % 18);
            // Spread vertically across the band; distribute by card index to avoid overlap.
            const perBand = Math.ceil(availableCurrent.length / 2);
            const bandIdx = Math.floor(i / 2);
            const step = 78 / Math.max(1, perBand);
            const top = 10 + bandIdx * step + ((c.seed * 7) % 6);
            const delay = (i * 0.12) % 1.0;

            // ver09: first two cards (one per band) move FAST horizontally for catching fun.
            const isFast = i < 2;
            const moveMode = c.seed % 3;
            const motionAnim = isFast
              ? { x: onLeft ? [0, 80, 0, -40, 0] : [0, -80, 0, 40, 0], rotate: [-6, 6, -6] }
              : moveMode === 0
                ? { y: [0, -12, 0, 12, 0], rotate: [-4, 4, -4] }
                : moveMode === 1
                  ? { x: onLeft ? [0, 24, 0, -8, 0] : [0, -24, 0, 8, 0], rotate: [-3, 3, -3] }
                  : { x: [0, onLeft ? 16 : -16, 0], y: [0, -8, 0], rotate: [2, -2, 2] };
            const moveDur = isFast ? 1.6 : 5 + (c.seed % 4);

            return (
              <motion.button
                key={`${activeIndex}-${c.scriptId}-${c.text}`}
                className="absolute pointer-events-auto rounded-card bg-white shadow-card px-5 py-3
                           flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                style={{
                  left: `${leftBase}%`,
                  top: `${top}%`,
                  borderTop: `4px solid ${SCRIPT_COLOR[c.scriptId]}`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  ...motionAnim,
                }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{
                  opacity: { duration: 0.5, delay },
                  scale: { duration: 0.5, delay },
                  x: { duration: moveDur, repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: moveDur, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 4 + (c.seed % 3), repeat: Infinity, ease: 'easeInOut' },
                }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handlePick(c, e)}
              >
                <span className="font-display text-[44px] leading-none" style={{ color: SCRIPT_COLOR[c.scriptId] }}>
                  {c.text}
                </span>
                <span className="text-small text-inkSoft">{SCRIPT_LABEL_KO[c.scriptId]}</span>
              </motion.button>
            );
          })}

          {/* ver09: fun extras (Hebrew/Arabic/Rune). First two are cloud-covered for visual fun.
              ver10: every card picks via pickFor; first click on a covered card reveals it,
              second click picks.
              ver11: the first cloud-covered card is the 꽝 — it has NO character inside.
              After reveal, clicking it removes the card (nothing to pick). */}
          {!isComplete && availableExtras.map((ex, i) => {
            const key = `${activeIndex}-x-${ex.scriptId}-${ex.text}`;
            if (removedDuds.has(key)) return null;

            const onLeft = i % 2 === 1; // offset opposite to main cards' alternation
            const leftBase = onLeft ? 22 + ((ex.seed * 5) % 6) : 70 + ((ex.seed * 5) % 6);
            const top = 14 + i * 26 + ((ex.seed * 3) % 6);
            const isCloud = i < 2;
            const isDud = i === 0;
            const revealed = revealedClouds.has(key);
            const reveal = () =>
              setRevealedClouds((s) => (s.has(key) ? s : new Set(s).add(key)));

            return (
              <motion.button
                key={key}
                className="absolute pointer-events-auto rounded-card bg-white shadow-card px-5 py-3
                           flex flex-col items-center gap-1 hover:scale-110 transition-transform overflow-hidden"
                style={{
                  left: `${leftBase}%`,
                  top: `${top}%`,
                  borderTop: `4px solid ${isDud ? '#CBD5E1' : SCRIPT_COLOR[ex.scriptId]}`,
                  minWidth: 92,
                  minHeight: 92,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: [0, onLeft ? 14 : -14, 0],
                  y: [0, -8, 0],
                  rotate: [-3, 3, -3],
                }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 },
                  x: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={isCloud ? reveal : undefined}
                onMouseMove={isCloud && !revealed ? reveal : undefined}
                onClick={(e) => {
                  if (isCloud && !revealed) { reveal(); return; }
                  if (isDud) {
                    setRemovedDuds((s) => new Set(s).add(key));
                    return;
                  }
                  handlePick(ex, e);
                }}
              >
                {isDud ? (
                  // 꽝: empty card — no glyph or label, just whitespace under the cloud.
                  <span className="block w-12 h-12" />
                ) : (
                  <>
                    <span className="font-display text-[44px] leading-none" style={{ color: SCRIPT_COLOR[ex.scriptId] }}>
                      {ex.text}
                    </span>
                    <span className="text-small text-inkSoft">{SCRIPT_LABEL_KO[ex.scriptId]}</span>
                  </>
                )}
                <AnimatePresence>
                  {isCloud && !revealed && (
                    <motion.div
                      key="cloud"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, x: [0, 4, -4, 0] }}
                      exit={{ opacity: 0, scale: 1.4 }}
                      transition={{
                        opacity: { duration: 0.3 },
                        x: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="absolute inset-0 rounded-card grid place-items-center
                                 bg-gradient-to-br from-white/95 to-white/80 text-[40px]"
                    >
                      <span className="drop-shadow-sm">☁️</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Center: syllable row + result slots (pushed down 50px per ver04, +20px per ver09) */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center gap-4 pt-[70px]">
        <div className="flex gap-6">
          {syllables.map((s, i) => {
            const done = !!picked[i];
            const active = i === activeIndex;
            return (
              <motion.button
                key={`syl-${i}`}
                onClick={() => picked[i] && setActiveIndex(i)}
                animate={active ? { scale: 1.08 } : { scale: done ? 1 : 0.95 }}
                className={`w-[130px] h-[130px] rounded-card grid place-items-center font-display text-[72px]
                  ${active ? 'ring-4 ring-primary bg-bgPaper shadow-cardLg' :
                   done ? 'bg-bgPaper shadow-card' : 'bg-white/40 text-ink/40'}`}
              >
                {s}
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-6 mt-1">
          {syllables.map((_, i) => (
            <motion.div
              key={`arr-${i}`}
              className="w-[130px] text-center font-display text-[32px] text-inkSoft"
              animate={i === activeIndex ? { y: [0, 4, 0] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ▼
            </motion.div>
          ))}
        </div>

        <div className="flex gap-6">
          {syllables.map((_, i) => {
            const p = picked[i];
            const active = i === activeIndex;
            return (
              <motion.button
                key={`slot-${i}`}
                onClick={() => p && unpick(i)}
                layout
                className={`w-[130px] h-[130px] rounded-card grid place-items-center font-display
                  ${p ? 'bg-white shadow-cardLg' :
                       'border-[3px] border-dashed border-inkSoft/50 bg-white/40'}
                  ${active && !p ? 'animate-pulse' : ''}`}
                style={p ? { borderTop: `6px solid ${SCRIPT_COLOR[p.scriptId]}` } : {}}
              >
                {p ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: [0, 1.15, 1], rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-[56px] leading-none" style={{ color: SCRIPT_COLOR[p.scriptId] }}>
                      {p.text}
                    </span>
                    <span className="text-small text-inkSoft">{SCRIPT_LABEL_KO[p.scriptId]}</span>
                  </motion.div>
                ) : (
                  <span className="text-[48px] text-inkSoft/50">?</span>
                )}
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* ver11: pick FX — gold star orbits the click point once and fades out.
          Replaces the previous "+점수" popup since score is no longer surfaced. */}
      <AnimatePresence>
        {orbits.map((o) => (
          <motion.div
            key={o.id}
            className="fixed pointer-events-none z-40"
            style={{ left: o.x, top: o.y }}
            initial={{ rotate: 0, opacity: 1 }}
            animate={{ rotate: 360, opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <span
              className="inline-block text-[44px] drop-shadow-[0_0_12px_rgba(255,211,94,0.9)]"
              style={{ transform: 'translate(-50%, -50%) translateX(64px)', color: '#FFB400' }}
            >
              ⭐
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ver15/16: intro modal — Papi static, fixed size shared with completion modal. */}
      <AnimatePresence>
        {showIntro && !isComplete && userName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 grid place-items-center z-40"
          >
            <motion.div
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className="bg-bgWarm rounded-card shadow-cardLg px-10 py-8 w-[760px] h-[360px] flex items-center gap-6"
            >
              <Papi size={180} mood="idle" showItems={false} still />
              <div className="flex-1 flex flex-col items-start gap-4">
                <SpeechBubble
                  text={`문자 나라는 모두 자기만의 문자 이름을 가지고 있어.\n"${userName}"의 이름을 다른 문자로 바꿔줘.`}
                  size="md"
                  tail="left"
                  typing
                />
                <Button size="lg" onClick={() => setShowIntro(false)}>
                  이름 바꾸기 →
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ver15/16: completion modal — same fixed dimensions as the intro modal. */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 grid place-items-center z-30"
          >
            <motion.div
              initial={{ scale: 0.5, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="bg-bgWarm rounded-card shadow-cardLg px-10 py-8 w-[760px] h-[360px] flex items-center gap-6"
            >
              <Papi size={180} mood="idle" showItems={false} still />
              <div className="flex-1 flex flex-col items-start gap-4">
                <SpeechBubble
                  text="이름을 바꿨으니 이제 캐릭터를 꾸며보자!"
                  size="md"
                  tail="left"
                  typing
                />
                <Button size="lg" onClick={() => nav('/customize')}>
                  꾸미러 가기 →
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
