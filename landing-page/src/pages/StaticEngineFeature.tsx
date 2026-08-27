import { ArrowLeft, Code2, Cpu, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StaticEngineFeature() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto flex-grow">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
            <Code2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-4xl font-medium tracking-tight">Static Rule Engine</h1>
            <p className="text-zinc-400 mt-2">Zero false-positive deterministic analysis</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 space-y-6">
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              At the core of APIVault is our high-performance Java Spring Boot engine. It ingests OpenAPI and Swagger specifications and transforms them into an internal execution graph.
            </p>
            
            <div className="space-y-4 mt-8">
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div>
                    <h3 className="text-zinc-100 font-medium mb-1">Sub-second Execution</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">Runs in CI/CD pipelines without slowing down builds. Analyzes 1000+ endpoints in under a second.</p>
                 </div>
               </div>
               
               <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div>
                    <h3 className="text-zinc-100 font-medium mb-1">Deterministic Rules</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">Unlike AI, the static engine relies on hard mathematical rules to guarantee zero false positives for structural flaws.</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
             <div className="premium-card p-6 border-white/10 bg-[#0C0C0C] shadow-2xl relative rounded-2xl h-full flex flex-col justify-center">
                <div className="flex justify-between items-center mb-6 text-sm text-zinc-500">
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4"/> Parsing Pipeline</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="space-y-3 font-mono text-xs text-zinc-300">
                  <div className="bg-[#151515] p-3 rounded border border-white/5">1. Ingest openapi.yaml</div>
                  <div className="flex justify-center text-zinc-600">↓</div>
                  <div className="bg-[#151515] p-3 rounded border border-white/5">2. Build Abstract Syntax Tree</div>
                  <div className="flex justify-center text-zinc-600">↓</div>
                  <div className="bg-[#151515] p-3 rounded border border-white/5 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">3. Execute 450+ Security Rules</div>
                  <div className="flex justify-center text-zinc-600">↓</div>
                  <div className="bg-[#151515] p-3 rounded border border-white/5">4. Generate JSON Report</div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
