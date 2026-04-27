import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useSession } from '../store/session';
import { itemsBySlot, itemsForScript, SLOT_BY_POSITION } from '../data/items';
import { SCRIPT_CULTURE_KO } from '../data/transliterations';
import type { CustomizationItem, ItemSlot, ScriptId } from '../types';

const SLOT_LABELS: { slot: ItemSlot; label: string; icon: string }[] = [
  { slot: 'hat',        label: '모자',   icon: '🎩' },
  { slot: 'outfit',     label: '의상',   icon: '🎽' },
  { slot: 'badge',      label: '장신구', icon: '✦' },
  { slot: 'background', label: '배경',   icon: '🏞️' },
];

function ItemButton({
  item, selected, onClick,
}: { item: CustomizationItem; selected: boolean; onClick: () => void }) {
  // ver17 size; kept compact since the picker now sits inside the right card.
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`relative w-full h-[92px] rounded-card shadow-card flex flex-col items-center justify-center gap-0.5
                  font-display text-body transition-all
                  ${selected ? 'ring-4 ring-primary bg-white shadow-cardLg' : 'bg-white hover:shadow-cardLg'}`}
      style={{ borderTop: `5px solid ${item.color}` }}
    >
      <div className="text-[30px] leading-none">{item.glyph}</div>
      <div className="text-[12px] text-ink px-1 text-center leading-tight">{item.labelKo}</div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-accent text-white w-6 h-6 rounded-full grid place-items-center text-[12px]"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

export default function CustomizePage() {
  const nav = useNavigate();
  const { userName, picked, customization, setCustomization, finalizeTicket, gender, setGender } = useSession();

  // ver12: position → slot map (0 bg, 1 hat, 2 outfit, 3 badge).
  const slotScript = useMemo<Record<ItemSlot, ScriptId | null>>(() => {
    const map: Record<ItemSlot, ScriptId | null> = {
      background: null, hat: null, outfit: null, badge: null,
    };
    SLOT_BY_POSITION.forEach((slot, idx) => {
      const choice = picked[idx];
      map[slot] = choice ? choice.scriptId : null;
    });
    return map;
  }, [picked]);

  // ver23: when no syllable maps to a slot (e.g. background for a 3-syllable name),
  // show ALL items — "어떤 [slot]이든 고를 수 있어." rather than a random theme.
  // ver23 follow-up: cap the background list at 8 so it doesn't get overwhelming.
  const optionsForSlot = (slot: ItemSlot): CustomizationItem[] => {
    const script = slotScript[slot];
    const all = !script || itemsForScript(slot, script).length === 0
      ? itemsBySlot(slot)
      : itemsForScript(slot, script);
    return slot === 'background' ? all.slice(0, 8) : all;
  };

  const [activeSlot, setActiveSlot] = useState<ItemSlot>('hat');
  const [justUnlockedPop, setJustUnlockedPop] = useState<string | null>(null);

  // Auto-pick the first themed option per slot on mount.
  useEffect(() => {
    SLOT_LABELS.forEach(({ slot }) => {
      if (!customization[slot]) {
        const opts = optionsForSlot(slot);
        if (opts[0]) setCustomization(slot, opts[0].id);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userName) nav('/name');
  }, [userName, nav]);

  const allSlotsFilled = SLOT_LABELS.every(({ slot }) => customization[slot]);

  const handleSubmit = () => {
    finalizeTicket();
    nav('/ticket');
  };

  const options = optionsForSlot(activeSlot);

  const handlePick = (item: CustomizationItem) => {
    setCustomization(activeSlot, item.id);
    setJustUnlockedPop(item.labelKo);
    setTimeout(() => setJustUnlockedPop(null), 900);
  };

  return (
    <AppShell stage="customize" hint="모자·의상·장신구·배경을 골라 너만의 캐릭터를 완성해봐!">
      {/* ver18: page is a vertical stack — heading | cards row | summary row. */}
      <div className="h-full flex flex-col gap-4 px-8 py-4 overflow-y-auto">
        {/* Page heading + ver23: 티켓 보기 button on the same row, right end. */}
        <div className="h-[52px] flex items-center justify-between">
          <h2 className="font-display text-h2 text-ink">너만의 캐릭터를 꾸며봐!</h2>
          <Button size="lg" onClick={handleSubmit} disabled={!allSlotsFilled}>
            티켓 보기 →
          </Button>
        </div>

        {/* Top row: left character card + right item picker card.
            ver19: cards bumped 20px taller via min-h. ver23-followup: nudged 10px down. */}
        <div className="flex-1 grid grid-cols-12 gap-5 min-h-0 mt-[10px]">
          {/* LEFT: gender toggle + character */}
          <section className="col-span-5 flex flex-col">
            <div className="flex-1 min-h-[445px] bg-white/70 rounded-card shadow-card p-4 flex flex-col items-stretch gap-3">
              {/* Gender toggle */}
              <div className="flex gap-2 bg-bgWarm rounded-pill p-1 shadow-card self-center">
                {(['boy', 'girl'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-1.5 rounded-pill font-display text-small transition-all
                      ${gender === g ? 'bg-primary text-white shadow-card' : 'text-ink hover:bg-white/60'}`}
                  >
                    {g === 'boy' ? '👦 남자아이' : '👧 여자아이'}
                  </button>
                ))}
              </div>

              {/* Character image fills remaining height of the card */}
              <div className="relative flex-1 min-h-0 overflow-hidden rounded-card">
                <img
                  src={gender === 'boy' ? '/assets/boy.png' : '/assets/girl.png'}
                  alt={gender === 'boy' ? '남자아이' : '여자아이'}
                  className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* ver23: syllable → script (culture) summary below the character. */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {picked.filter(Boolean).map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white rounded-pill shadow-card font-display text-small text-ink"
                  >
                    <b className="text-primary">{p!.syllable}</b>
                    <span className="text-inkSoft mx-1">→</span>
                    {SCRIPT_CULTURE_KO[p!.scriptId]}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: slot toggle + item picker. ver19: 완성 button moved out (under 장신구 tile). */}
          <section className="col-span-7 flex flex-col">
            <div className="flex-1 min-h-[445px] bg-white/70 rounded-card shadow-card p-4 flex flex-col gap-3">
              {/* ver18: slot tabs moved INSIDE the right card as a pill toggle (mirrors gender toggle). */}
              <div className="flex gap-1 bg-bgWarm rounded-pill p-1 shadow-card self-center">
                {SLOT_LABELS.map(({ slot, label, icon }) => (
                  <button
                    key={slot}
                    onClick={() => setActiveSlot(slot)}
                    className={`px-3 py-1.5 rounded-pill font-display text-small flex items-center gap-1.5 transition-all
                      ${activeSlot === slot
                        ? 'bg-primary text-white shadow-card'
                        : 'text-ink hover:bg-white/60'}`}
                  >
                    <span className="text-[18px]">{icon}</span>
                    {label}
                    {customization[slot] && (
                      <span className={`rounded-full w-4 h-4 grid place-items-center text-[11px]
                        ${activeSlot === slot ? 'bg-white/30 text-white' : 'bg-primary/15 text-primary'}`}>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ver23: guidance line referencing the syllable→script for the active slot. */}
              <div className="text-center font-display text-small text-inkSoft">
                {(() => {
                  const activeLabel = SLOT_LABELS.find((s) => s.slot === activeSlot)?.label ?? '';
                  const script = slotScript[activeSlot];
                  return script
                    ? `${SCRIPT_CULTURE_KO[script]} 문화권의 ${activeLabel} 아이템을 선택할 수 있어.`
                    : `어떤 ${activeLabel}이든 고를 수 있어.`;
                })()}
              </div>

              {/* ver21: items grid sits at top of remaining space; summary tiles 1×4 at bottom.
                  ver22: items pushed down 5px; divider added above summary tiles. */}
              <div className="flex-1 flex flex-col gap-3 min-h-0">
                {/* Items grid — top-aligned with a small 5px nudge per ver22. */}
                <div className="flex flex-col min-h-0 mt-[5px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlot}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-4 gap-3"
                    >
                      {options.map((it) => (
                        <ItemButton
                          key={it.id}
                          item={it}
                          selected={customization[activeSlot] === it.id}
                          onClick={() => handlePick(it)}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ver22: divider above the selection summary. */}
                <div className="mt-auto h-px bg-ink/15" />

                {/* ver21: 1×4 selection-summary tiles at the bottom of the right card. */}
                <div className="grid grid-cols-4 gap-2">
                  {SLOT_LABELS.map(({ slot, label, icon }) => {
                    const id = customization[slot];
                    const opts = itemsBySlot(slot);
                    const it = id ? opts.find((o) => o.id === id) : undefined;
                    return (
                      <div
                        key={slot}
                        className="relative bg-white rounded-card shadow-card overflow-hidden"
                      >
                        <div
                          className="h-1.5 w-full"
                          style={{ background: it?.color ?? '#E5E7EB' }}
                        />
                        <div className="px-2 pt-1.5 pb-2 flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1 text-inkSoft font-display text-[11px]">
                            <span className="text-[12px] opacity-70">{icon}</span>
                            <span>{label}</span>
                          </div>
                          <div className="text-[28px] leading-none my-0.5">
                            {it?.glyph ?? '·'}
                          </div>
                          <div className="font-display text-[11px] text-ink truncate max-w-full">
                            {it?.labelKo ?? '—'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ver23: 티켓 보기 button moved to heading row — bottom button row removed. */}
      </div>

      <AnimatePresence>
        {justUnlockedPop && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-pill font-display text-h3 shadow-cardLg z-40"
          >
            👗 {justUnlockedPop} 장착!
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
