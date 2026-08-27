import { ArrowLeft, Shield, AlertCircle, Database, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OwaspFeature() {
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
          <div className="bg-zinc-900 rounded-xl p-3 border border-white/10">
            <Shield className="w-8 h-8 text-zinc-400" />
          </div>
          <div>
            <h1 className="text-4xl font-medium tracking-tight">OWASP API Framework</h1>
            <p className="text-zinc-400 mt-2">Comprehensive protection against the API Security Top 10</p>
          </div>
        </div>

        <div className="space-y-12">
          <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-3xl">
            APIVault is built from the ground up around the OWASP API Security Top 10 (2023). 
            Our platform doesn't just look for traditional web vulnerabilities; it understands the unique 
            structure of REST and GraphQL APIs to identify complex structural and logical flaws before they hit production.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="premium-card p-6 border-rose-500/20 bg-rose-500/5">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-zinc-100 font-medium">BOLA (API1:2023)</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Broken Object Level Authorization occurs when an endpoint relies on client-provided IDs without checking server-side ownership. APIVault traces data bindings to detect missing auth checks.
              </p>
              <div className="bg-[#050505] p-3 rounded-lg border border-white/5 font-mono text-xs text-rose-300">
                GET /api/v1/receipts/&#123;receipt_id&#125;
              </div>
            </div>

            <div className="premium-card p-6 border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-emerald-500" />
                <h3 className="text-zinc-100 font-medium">Mass Assignment (API3:2023)</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                When APIs allow clients to update internal object properties (like role="admin"). We analyze your schemas and flag overly-permissive request bodies.
              </p>
              <div className="bg-[#050505] p-3 rounded-lg border border-white/5 font-mono text-xs text-emerald-300">
                PATCH /api/v1/users/me
              </div>
            </div>

            <div className="premium-card p-6 border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-blue-400" />
                <h3 className="text-zinc-100 font-medium">Broken Authentication (API2:2023)</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Detects weak JWT implementations, missing expiration checks, and unauthenticated endpoints that should be protected based on naming conventions.
              </p>
            </div>
            
            <div className="premium-card p-6 border-purple-500/20 bg-purple-500/5 flex flex-col justify-center items-center text-center">
               <CheckCircle2 className="w-8 h-8 text-purple-400 mb-3" />
               <h3 className="text-zinc-100 font-medium mb-2">98% Coverage</h3>
               <p className="text-sm text-zinc-400">Our engine maps out and tests for all 10 major risk categories deterministically.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
