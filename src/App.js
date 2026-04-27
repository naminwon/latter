import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }, children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(AttractPage, {}) }), _jsx(Route, { path: "/intro", element: _jsx(IntroPage, {}) }), _jsx(Route, { path: "/name", element: _jsx(NamePage, {}) }), _jsx(Route, { path: "/scripts", element: _jsx(ScriptsPage, {}) }), _jsx(Route, { path: "/customize", element: _jsx(CustomizePage, {}) }), _jsx(Route, { path: "/ticket", element: _jsx(TicketPage, {}) }), _jsx(Route, { path: "*", element: _jsx(AttractPage, {}) })] }) }, location.pathname) }));
}
