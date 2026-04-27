import React from 'react';
import { TopBar } from './TopBar';
import { HintBar } from './HintBar';

interface Props {
  stage: string;
  hint?: string;
  showChrome?: boolean;
  showBack?: boolean;
  showHome?: boolean;
  backDisabled?: boolean;
  homeDisabled?: boolean;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  dimChrome?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  stage,
  hint,
  showChrome = true,
  showBack = true,
  showHome = true,
  backDisabled = false,
  homeDisabled = false,
  onBack,
  rightSlot,
  dimChrome = false,
  children,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col paper-bg">
      {showChrome && <TopBar currentStage={stage} dim={dimChrome} />}
      <main className="flex-1 relative overflow-hidden">{children}</main>
      {showChrome && (
        <HintBar
          hint={hint}
          showBack={showBack}
          showHome={showHome}
          backDisabled={backDisabled}
          homeDisabled={homeDisabled}
          onBack={onBack}
          rightSlot={rightSlot}
        />
      )}
    </div>
  );
}
