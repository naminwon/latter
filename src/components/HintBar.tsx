import { useNavigate } from 'react-router-dom';

interface Props {
  hint?: string;
  showBack?: boolean;
  showHome?: boolean;
  // ver14: split disable so 처음으로 always reaches home; only 뒤로 can be disabled.
  // ver15: 처음으로 also gets its own disable flag (used on ScriptsPage completion).
  backDisabled?: boolean;
  homeDisabled?: boolean;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function HintBar({
  hint, showBack = true, showHome = true,
  backDisabled = false, homeDisabled = false,
  onBack, rightSlot,
}: Props) {
  const nav = useNavigate();

  const goBack = () => { if (onBack) onBack(); else nav(-1); };

  const goHome = () => {
    // ver15: just navigate. AttractPage performs the reset on mount, which
    // avoids the race with per-page guards (e.g., ScriptsPage's `!userName -> /name`).
    nav('/');
  };

  const backDimClass = backDisabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : 'hover:bg-white';
  const homeDimClass = homeDisabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : 'hover:bg-white';

  return (
    <footer className="h-[72px] px-12 flex items-center justify-between bg-bgWarm/80 backdrop-blur border-t border-ink/5">
      <div className="w-[260px] flex items-center gap-3">
        {showBack && (
          <button
            onClick={goBack}
            disabled={backDisabled}
            aria-disabled={backDisabled}
            className={`flex items-center gap-2 px-4 h-[48px] rounded-pill bg-white/80 shadow-card text-ink font-display text-body ${backDimClass}`}
          >
            ← 뒤로
          </button>
        )}
        {showHome && (
          <button
            onClick={goHome}
            disabled={homeDisabled}
            aria-disabled={homeDisabled}
            className={`flex items-center gap-2 px-4 h-[48px] rounded-pill bg-white/80 shadow-card text-ink font-display text-body ${homeDimClass}`}
          >
            🏠 처음으로
          </button>
        )}
      </div>
      <div className="flex-1 text-center text-inkSoft font-display text-body">
        {hint ?? ''}
      </div>
      {/* ver11: bottom-right star/score removed */}
      <div className="w-[260px] flex items-center justify-end gap-3">
        {rightSlot}
      </div>
    </footer>
  );
}
