import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Landing from './pages/Landing';
import Docs from './pages/Docs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import OwaspFeature from './pages/OwaspFeature';
import StaticEngineFeature from './pages/StaticEngineFeature';
import AiFeature from './pages/AiFeature';
import AnalyzePage from './pages/AnalyzePage';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-oled text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400 font-sans font-light flex flex-col">
      
      {/* Navbar - Shared across pages */}
      <nav className="fixed w-full z-50 top-0 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
            <AnimatedLogo />
          </Link>
          

          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="hidden md:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Sign In
            </button>
            <button className="hidden md:block bg-zinc-100 hover:bg-zinc-300 text-oled px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)] border border-border-subtle">
              Start Building
            </button>
            <button 
              className="md:hidden text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-16 left-0 w-full bg-[#0A0A0A] border-b border-white/10 shadow-2xl py-6 px-6 flex flex-col gap-6"
            >

              <button className="text-left text-zinc-300 hover:text-white font-medium text-lg">Sign In</button>
              <button className="bg-emerald-500 text-oled px-4 py-3 rounded-xl font-medium text-center mt-2 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] border border-border-subtle">Start Building</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/feature/owasp" element={<OwaspFeature />} />
          <Route path="/feature/static-engine" element={<StaticEngineFeature />} />
          <Route path="/feature/ai-judgment" element={<AiFeature />} />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
      </main>

      {/* Footer - Shared across pages */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-medium text-sm tracking-tight text-white">APIVault Security</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-400 font-light">Made by Pritam Rangari</span>
          </div>
          <div className="flex justify-center md:justify-end gap-6 text-sm text-gray-400 font-light">
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
      <ScrollButton />
    </div>
  );
}

const AnimatedLogo = () => {
  return (
    <div className="flex items-center text-xl font-bold tracking-tighter">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
        APIVault
      </span>
    </div>
  );
};

const ScrollButton = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md transition-all group"
      aria-label="Scroll"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isAtTop ? (
            <motion.div
              key="down"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </motion.div>
          ) : (
            <motion.div
              key="up"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default App;

