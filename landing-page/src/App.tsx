import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Landing from './pages/Landing';
import Docs from './pages/Docs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import OwaspFeature from './pages/OwaspFeature';
import StaticEngineFeature from './pages/StaticEngineFeature';
import AiFeature from './pages/AiFeature';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-oled text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400 font-sans font-light flex flex-col">
      
      {/* Navbar - Shared across pages */}
      <nav className="fixed w-full z-50 top-0 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-lg font-medium tracking-tight">APIVault</span>
          </Link>
          

          
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Sign In
            </button>
            <button className="hidden md:block bg-zinc-100 hover:bg-white text-oled px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]">
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
              <button className="bg-emerald-500 text-oled px-4 py-3 rounded-xl font-medium text-center mt-2 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">Start Building</button>
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
        </Routes>
      </main>

      {/* Footer - Shared across pages */}
      <footer className="border-t border-white/5 py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-medium text-sm tracking-tight text-zinc-300">APIVault Security</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500 font-light">
            <Link to="/docs" className="hover:text-zinc-300 transition-colors">Documentation</Link>
            <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
