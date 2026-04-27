import { useSession } from '../store/session';

// ver16: goodbye stage removed (작별인사 page deleted; 인쇄하기 ends the flow on /ticket).
const STAGES = ['attract', 'intro', 'name', 'scripts', 'customize', 'ticket'] as const;

export function TopBar({ currentStage, dim = false }: { currentStage: string; dim?: boolean }) {
  const locale = useSession((s) => s.locale);
  const setLocale = useSession((s) => s.setLocale);
  const idx = STAGES.indexOf(currentStage as (typeof STAGES)[number]);

  return (
    <header
      className={`h-[72px] px-12 flex items-center justify-between sticky top-0 z-20 bg-bgWarm/80 backdrop-blur
                  transition-opacity ${dim ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center font-display text-[20px] shadow-card">
          문
        </div>
        <span className="font-display text-[24px] text-ink">문자 나라</span>
      </div>

      <nav className="flex items-center gap-3">
        {STAGES.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === idx
                ? 'w-5 h-5 bg-primary shadow-glow'
                : i < idx
                  ? 'w-3 h-3 bg-primary/70'
                  : 'w-3 h-3 bg-ink/20'
            }`}
          />
        ))}
      </nav>

      <div className="flex items-center gap-1 bg-white rounded-pill shadow-card p-1">
        {(['ko', 'en', 'ja', 'zh'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`px-3 py-1 rounded-pill text-small font-display transition-colors ${
              locale === l ? 'bg-primary text-white' : 'text-inkSoft hover:bg-bgWarm'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
