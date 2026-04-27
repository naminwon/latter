import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { useSession } from '../store/session';
import { SCRIPT_COLOR, SCRIPT_LABEL_KO } from '../data/transliterations';
import { itemById } from '../data/items';
import type { ItemSlot } from '../types';

const SLOT_ORDER: { slot: ItemSlot; label: string }[] = [
  { slot: 'hat', label: '모자' },
  { slot: 'outfit', label: '의상' },
  { slot: 'badge', label: '장신구' },
  { slot: 'background', label: '배경' },
];

export default function TicketPage() {
  const nav = useNavigate();
  const { ticket, userName, gender } = useSession();

  useEffect(() => {
    if (!ticket) nav('/customize');
  }, [ticket, nav]);

  if (!ticket) return null;

  const qrPayload = `letterland://ticket/${ticket.id}?name=${encodeURIComponent(userName)}`;

  return (
    <AppShell stage="ticket" hint="💡 QR을 찍어서 엄마·아빠 폰에 저장할 수 있어!">
      <div className="h-full flex flex-col items-center justify-center px-8 py-4 gap-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display text-h2 text-ink"
        >
          🎉 {userName}의 입장권이 나왔어! 🎉
        </motion.h1>

        {/* ver13: long horizontal ticket — character | converted name | QR */}
        <motion.article
          initial={{ y: 200, rotate: -1, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
          className="relative w-[1100px] max-w-[95vw] bg-bgPaper rounded-card shadow-cardLg overflow-hidden
                     grid grid-cols-[280px_1fr_200px] gap-6 p-6"
        >
          <div className="absolute inset-0 card-stripe opacity-60 pointer-events-none" />

          {/* LEFT: chosen character image */}
          <div className="relative z-10 flex flex-col items-center justify-between">
            <div className="relative w-full h-[260px] overflow-hidden rounded-card">
              <img
                src={gender === 'boy' ? '/assets/boy.png' : '/assets/girl.png'}
                alt={gender === 'boy' ? '남자아이' : '여자아이'}
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                draggable={false}
              />
            </div>
            {/* ver13: selected items — glyphs row at the bottom */}
            <div className="mt-3 grid grid-cols-4 gap-2 w-full">
              {SLOT_ORDER.map(({ slot, label }) => {
                const it = itemById(ticket.customization[slot]);
                return (
                  <div
                    key={slot}
                    className="bg-white rounded-card shadow-card flex flex-col items-center py-1.5"
                    style={it ? { borderTop: `3px solid ${it.color}` } : {}}
                  >
                    <span className="text-[24px] leading-none">{it?.glyph ?? '·'}</span>
                    <span className="font-display text-[10px] text-inkSoft mt-0.5">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER: converted name (ver16: title + LETTER LAND TICKET stacked, names centered, footer single-line) */}
          <section className="relative z-10 flex flex-col text-center">
            <div className="flex flex-col items-center">
              <h2 className="font-display text-h2 text-ink">✦ 문자나라 입장권 ✦</h2>
              <p className="font-display text-small text-inkSoft tracking-wider mt-1">LETTER LAND TICKET</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-5">
                {ticket.syllableMap.map((p, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[80px]">
                    <span className="font-display text-[32px] text-inkSoft leading-none">
                      {p.syllable}
                    </span>
                    <span className="text-[20px] text-inkSoft my-1">▼</span>
                    <span
                      className="font-display text-[64px] leading-none"
                      style={{ color: SCRIPT_COLOR[p.scriptId] }}
                    >
                      {p.text}
                    </span>
                    <span className="text-small text-inkSoft mt-1">
                      {SCRIPT_LABEL_KO[p.scriptId]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="font-display text-small text-inkSoft mt-2 whitespace-nowrap">
              국립세계문자박물관 · {new Date(ticket.issuedAt).toLocaleDateString('ko-KR')} · No.{ticket.id}
            </div>
          </section>

          {/* RIGHT: QR */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="bg-white p-3 rounded-card shadow-card">
              <QRCodeSVG value={qrPayload} size={170} />
            </div>
          </div>

          {/* ver14: perforations placed in the column-gap, not over the column content,
              so the character image (left) and QR (right) are not clipped. */}
          <div className="absolute top-6 bottom-6 left-[316px] w-0 border-l-2 border-dashed border-ink/20" />
          <div className="absolute top-6 bottom-6 right-[236px] w-0 border-l-2 border-dashed border-ink/20" />
        </motion.article>

        <div className="flex gap-4">
          {/* ver16: 작별 인사 → 인쇄하기. Goodbye page is removed. */}
          <Button size="lg" onClick={() => window.print()}>
            🖨 인쇄하기
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
