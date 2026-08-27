import { Shield, Code2, Search, FileCode2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Docs() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="bg-zinc-900 rounded-xl p-3 border border-white/10">
            <FileCode2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-medium tracking-tight">Documentation</h1>
        </div>

        <div className="prose prose-invert prose-emerald max-w-none">
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">Overview</h2>
          <p className="text-zinc-400 font-light leading-relaxed mb-8 text-lg">
            APIVault is a modern, deterministic security audit tool for APIs. It allows developers to upload OpenAPI specifications and instantly receive a comprehensive security report. The system combines a fast static rule engine (mapping to OWASP API Top 10) with an AI heuristic layer to catch complex business logic flaws.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-12">Core Architecture</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-emerald-400 font-medium mb-3 flex items-center gap-2 text-lg"><Code2 className="w-5 h-5" /> Static Engine</h3>
              <p className="text-zinc-400 font-light leading-relaxed">Written in Java Spring Boot. Parses the OpenAPI spec structure to deterministically find missing auth schemes, BOLA, and excessive data exposure.</p>
            </div>
            <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-blue-400 font-medium mb-3 flex items-center gap-2 text-lg"><Search className="w-5 h-5" /> AI Heuristics</h3>
              <p className="text-zinc-400 font-light leading-relaxed">Powered by Python and GPT-4. Evaluates business logic context, endpoint naming conventions, and parameter handling to catch complex multi-step vulnerabilities.</p>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-12">Getting Started</h2>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 mb-12 leading-loose shadow-xl overflow-x-auto">
            <div className="text-zinc-500 mb-2 font-sans text-[10px] sm:text-xs uppercase tracking-wider"># 1. Start the analysis agent</div>
            <div className="whitespace-nowrap"><span className="text-emerald-400">$</span> apivault analyze ./openapi.json --strict</div>
            
            <div className="text-zinc-500 mt-6 mb-2 font-sans text-[10px] sm:text-xs uppercase tracking-wider"># 2. View the generated report</div>
            <div className="whitespace-nowrap"><span className="text-emerald-400">$</span> cat ./apivault-report.json</div>
          </div>

          <h2 className="text-2xl font-medium text-zinc-100 mb-6 mt-12">Security Rules & Compliance</h2>
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <ul className="space-y-6 text-zinc-300 font-light">
              <li className="flex gap-4 items-start">
                <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">Maps directly to OWASP API Security Top 10 (2023).</span>
              </li>
              <li className="flex gap-4 items-start">
                <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">Generates auditor-ready reports for SOC2 and HIPAA compliance.</span>
              </li>
              <li className="flex gap-4 items-start">
                <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">Zero-trust by default: flags any endpoint without explicit security schemes.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
