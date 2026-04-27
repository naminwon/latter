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

type Mode = 'idle' | 'recording' | 'confirm' | 'keyboard' | 'emoji';

export default function NamePage() {
  const nav = useNavigate();
  const setUserName = useSession((s) => s.setUserName);

  const [mode, setMode] = useState<Mode>('idle');
  const [typed, setTyped] = useState('');
  const [heard, setHeard] = useState('');
  const [cameFromConfirm, setCameFromConfirm] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState<(typeof EMOJI_NAMES)[number] | null>(null);

  const startRecording = () => {
    setMode('recording');
    setTimeout(() => {
      setHeard('나민원');
      setMode('confirm');
    }, 1500);
  };

  const commit = (name: string) => {
    setUserName(name);
    nav('/scripts');
  };

  const bubbleText =
    mode === 'idle' ? '네 이름을 알고 싶어.\n마이크를 눌러서 이름을 말해줘.' :
    mode === 'recording' ? '듣고 있어... 🎧' :
    mode === 'confirm' ? `이름이 "${heard}"이구나!` :
    mode === 'keyboard' ? (cameFromConfirm
      ? '내가 잘 못 들었나봐.\n키보드를 눌러서 이름을 입력해줘!'
      : '키보드를 눌러서 이름을 입력해줘!') :
    '이름을 말하기 부끄럽다면 좋아하는 동물을 선택해 보자!';

  const footerHint =
    mode === 'recording' ? '너의 이름을 듣고 있어' :
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
    if (mode !== 'emoji') setPickedEmoji(null);
  }, [mode]);

  // Panels are raised higher in keyboard/emoji to keep the footer visible.
  const rightPt = (mode === 'keyboard' || mode === 'emoji') ? 'pt-8' : 'pt-32';

  return (
    <AppShell stage="name" hint={footerHint} onBack={onBack}>
      <div className="h-full grid grid-cols-12 gap-8 items-start px-12 py-6">
        {/* LEFT: big Papi + big speech bubble */}
        <div className="col-span-6 flex items-center gap-6 pt-16">
          <Papi
            size={340}
            mood={mode === 'recording' ? 'thinking' : 'talking'}
            showItems={false}
          />
          <SpeechBubble
            text={bubbleText}
            size="lg"
            tail="left"
            typing
            className="w-[460px] min-h-[200px]"
          />
        </div>

        {/* RIGHT: mic + fallbacks */}
        <div className={`col-span-6 flex flex-col items-center gap-6 ${rightPt}`}>
          <AnimatePresence mode="wait">
            {mode === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative -translate-y-5">
                  <motion.button
                    onClick={startRecording}
                    whileTap={{ scale: 0.92 }}
                    className="w-[260px] h-[260px] rounded-full bg-primary text-white text-[112px]
                               shadow-cardLg grid place-items-center"
                  >
                    🎤
                  </motion.button>
                  <motion.div
                    className="absolute -inset-3 rounded-full border-4 border-primary/50 pointer-events-none"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                </div>
                <p className="font-display text-h3 text-inkSoft">▶ 마이크를 누르고 말해봐</p>
                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => { setTyped(''); setCameFromConfirm(false); setMode('keyboard'); }}
                  >
                    ⌨ 직접 입력
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setMode('emoji')}>
                    🐱 동물 이름
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === 'recording' && (
              <motion.div
                key="rec"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  className="w-[260px] h-[260px] rounded-full bg-danger/90 text-white text-[112px] grid place-items-center shadow-cardLg"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  🎤
                </motion.div>
                <p className="font-display text-h3 text-danger">● REC</p>
              </motion.div>
            )}

            {mode === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-card shadow-cardLg p-10 w-[520px] text-center"
              >
                <p className="font-display text-[36px] text-ink mb-2">네 이름이</p>
                <p className="font-display text-[56px] text-primary mb-6">"{heard}"</p>
                <p className="font-display text-[28px] text-ink mb-8">맞아?</p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => { setTyped(heard); setCameFromConfirm(true); setMode('keyboard'); }}
                  >
                    🙅 아니야!<br />수정할게
                  </Button>
                  <Button size="lg" onClick={() => commit(heard)}>
                    ✅ 맞아!
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === 'keyboard' && (
              <motion.div
                key="kb"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-card shadow-cardLg p-6 w-[580px]"
              >
                <p className="font-display text-h3 text-ink mb-3 text-center">
                  이름을 입력해 줘!
                </p>
                <div
                  className="w-full min-h-[88px] text-center font-display text-[44px] text-ink
                             py-4 rounded-card bg-bgWarm flex items-center justify-center"
                >
                  {typed || <span className="text-inkSoft/60">예) 나민원</span>}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-1 inline-block w-[3px] h-[40px] bg-ink align-middle"
                  />
                </div>
                <div className="mt-5 flex justify-center">
                  <VirtualKeyboard value={typed} onChange={setTyped} maxLen={14} />
                </div>
                <div className="flex justify-center mt-6">
                  <Button size="lg" onClick={() => typed.trim() && commit(typed.trim())}>
                    만들기 →
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === 'emoji' && (
              <motion.div
                key="emo"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-card shadow-cardLg p-6 w-[560px]"
              >
                <p className="font-display text-h3 text-ink mb-4 text-center">
                  어떤 동물로 할까?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {EMOJI_NAMES.map((e) => (
                    <motion.button
                      key={e.name}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setPickedEmoji(e)}
                      className={`h-[110px] rounded-card shadow-card grid place-items-center transition-all
                        ${pickedEmoji?.name === e.name
                          ? 'bg-primary/15 ring-4 ring-primary'
                          : 'bg-bgWarm hover:bg-white'}`}
                    >
                      <div className="text-[44px] leading-none">{e.emoji}</div>
                      <div className="font-display text-body text-ink">{e.label}</div>
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button
                    size="lg"
                    disabled={!pickedEmoji}
                    onClick={() => pickedEmoji && commit(pickedEmoji.name)}
                  >
                    만들기 →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
