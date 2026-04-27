import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '../components/AppShell';
import { Papi } from '../components/Papi';
import { SpeechBubble } from '../components/SpeechBubble';
import { Button } from '../components/Button';

export default function IntroPage() {
  const nav = useNavigate();
  const [ctaVisible, setCtaVisible] = useState(false);

  return (
    <AppShell stage="intro" hint="입장권을 만들어보자 😊" showBack={false}>
      <div className="h-full grid grid-cols-12 gap-6 items-center px-12 py-8">
        <div className="col-span-5 flex justify-center">
          <Papi size={420} mood="talking" showItems={false} />
        </div>
        <div className="col-span-7 flex flex-col items-start gap-6">
          <SpeechBubble
            text={`안녕, 나는 문자 나라 지킴이 파피야!\n문자 나라에 들어가려면 입장권이 필요해.\n나랑 같이 입장권을 만들어 볼래? 🎟️`}
            size="lg"
            tail="left"
            onFinish={() => setCtaVisible(true)}
          />
          <AnimatePresence>
            {ctaVisible && (
              <motion.div
                key="cta-group"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start gap-4"
              >
                <Button size="xl" onClick={() => nav('/name')}>
                  시작하기 →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
