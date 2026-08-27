import { ArrowLeft, Search, Bot, MessageSquareCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AiFeature() {
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
          <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-medium tracking-tight">AI Judgment Layer</h1>
            <p className="text-zinc-400 mt-2">Catching complex business logic flaws</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-5/12 space-y-6">
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              While static analysis catches structural bugs, business logic vulnerabilities (like a user deleting someone else's post) require context. Our Python-based AI heuristics engine provides that context.
            </p>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl space-y-4">
              <h3 className="text-zinc-100 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> Capabilities
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400 font-light list-disc list-inside">
                <li>Analyzes endpoint naming context (e.g. `admin` vs `user`)</li>
                <li>Identifies inconsistent parameter validation</li>
                <li>Flags suspicious data exposure in response schemas</li>
                <li>Generates framework-specific code snippets to fix the issues</li>
              </ul>
            </div>
          </div>
          
          <div className="lg:w-7/12">
             <div className="premium-card border-blue-500/20 bg-[#0C0C0C] shadow-[0_0_40px_rgba(59,130,246,0.1)] relative rounded-2xl h-full flex flex-col overflow-hidden">
                <div className="bg-[#151515] border-b border-white/5 p-4 flex items-center gap-3">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-zinc-200">Heuristics Output</span>
                </div>
                
                <div className="p-6 space-y-6 flex-grow">
                   <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                       <MessageSquareCode className="w-4 h-4 text-zinc-400" />
                     </div>
                     <div className="bg-zinc-900 border border-white/5 rounded-xl rounded-tl-none p-4 text-sm text-zinc-300 font-light leading-relaxed">
                       I've detected a potential Broken Object Level Authorization (BOLA) flaw in <code className="bg-zinc-800 px-1 py-0.5 rounded text-rose-300">DELETE /api/docs/&#123;id&#125;</code>. The endpoint requires a valid JWT, but it does not verify if the token owner actually owns the document being deleted.
                     </div>
                   </div>
                   
                   <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                       <Bot className="w-4 h-4 text-blue-400" />
                     </div>
                     <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl rounded-tl-none p-4 w-full">
                       <p className="text-sm text-zinc-300 font-light mb-3">Here is a suggested fix using Express.js middleware:</p>
                       <div className="bg-[#050505] p-3 rounded border border-white/5 font-mono text-xs text-zinc-400 whitespace-pre overflow-x-auto">
{`app.delete('/api/docs/:id', requireAuth, 
  async (req, res) => {
    const doc = await db.docs.find(req.params.id);
+   if (doc.ownerId !== req.user.id) {
+     return res.status(403).send('Forbidden');
+   }
    await doc.delete();
});`}
                       </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
