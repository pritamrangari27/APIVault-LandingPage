import { Routes, Route, Link } from 'react-router-dom';

import Landing from './pages/Landing';
import Docs from './pages/Docs';

function App() {
  return (
    <div className="min-h-screen bg-oled text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400 font-sans font-light flex flex-col">
      
      {/* Navbar - Shared across pages */}
      <nav className="fixed w-full z-50 top-0 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <span className="text-lg font-medium tracking-tight">APIVault</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link to="/#features" className="hover:text-zinc-100 transition-colors">Platform</Link>
            <Link to="/#how-it-works" className="hover:text-zinc-100 transition-colors">Engine</Link>
            <Link to="/docs" className="hover:text-zinc-100 transition-colors">Documentation</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Sign In
            </button>
            <button className="bg-zinc-100 hover:bg-white text-oled px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]">
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
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
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
