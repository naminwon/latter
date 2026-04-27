import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AttractPage from './pages/AttractPage';
import IntroPage from './pages/IntroPage';
import NamePage from './pages/NamePage';
import ScriptsPage from './pages/ScriptsPage';
import CustomizePage from './pages/CustomizePage';
import TicketPage from './pages/TicketPage';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<AttractPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/name" element={<NamePage />} />
          <Route path="/scripts" element={<ScriptsPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="*" element={<AttractPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
