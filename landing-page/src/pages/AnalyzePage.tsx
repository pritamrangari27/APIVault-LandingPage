import { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud, Code, FileCode2, Play, AlertCircle, Shield, CheckCircle2, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type ScanStep = 'idle' | 'ingesting' | 'static' | 'ai' | 'complete';

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [scanStep, setScanStep] = useState<ScanStep>('idle');

  // Simulate the scanning process
  useEffect(() => {
    if (scanStep === 'idle' || scanStep === 'complete') return;

    let timeout: NodeJS.Timeout;
    
    if (scanStep === 'ingesting') {
      timeout = setTimeout(() => setScanStep('static'), 1500);
    } else if (scanStep === 'static') {
      timeout = setTimeout(() => setScanStep('ai'), 2000);
    } else if (scanStep === 'ai') {
      timeout = setTimeout(() => setScanStep('complete'), 2500);
    }

    return () => clearTimeout(timeout);
  }, [scanStep]);

  const handleRunAudit = () => {
    setScanStep('ingesting');
  };

  const resetAudit = () => {
    setScanStep('idle');
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto flex-grow flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow flex flex-col"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight mb-2 text-zinc-100">Analyze API Specification</h1>
          <p className="text-zinc-400 font-light">Upload your OpenAPI/Swagger definition to instantly identify structural and logic flaws.</p>
        </div>

        <div className="flex-grow flex flex-col premium-card overflow-hidden shadow-2xl relative min-h-[500px]">
          
          <AnimatePresence mode="wait">
            {scanStep === 'complete' ? (
              <ResultsDashboard key="results" onReset={resetAudit} />
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col h-full"
              >
                {/* Tabs */}
                <div className="flex border-b border-zinc-800 bg-zinc-900">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <UploadCloud className="w-4 h-4" /> File Upload
                  </button>
                  <button 
                    onClick={() => setActiveTab('paste')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'paste' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Code className="w-4 h-4" /> Paste Raw Spec
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow p-8 flex flex-col items-center justify-center relative">
                  {activeTab === 'upload' ? (
                    <label className="w-full max-w-2xl border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors bg-zinc-900/50 cursor-pointer group relative overflow-hidden">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".json,.yaml,.yml"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleRunAudit();
                          }
                        }} 
                      />
                      <div className="w-16 h-16 rounded-full bg-surface border border-zinc-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                        <FileCode2 className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h3 className="text-lg font-medium text-zinc-100 mb-2">Drag & Drop your API Spec</h3>
                      <p className="text-sm text-zinc-400 font-light max-w-md mb-6">
                        Supports OpenAPI v2.0, v3.0, and v3.1 in JSON or YAML format. Maximum file size: 50MB.
                      </p>
                      <div className="bg-zinc-800 group-hover:bg-zinc-700 text-zinc-100 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                        Browse Files
                      </div>
                    </label>
                  ) : (
                    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-zinc-800 bg-surface">
                      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
                        <div className="text-xs text-zinc-500 font-mono">openapi.yaml</div>
                        <div className="flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                        </div>
                      </div>
                      <textarea 
                        className="flex-grow w-full bg-transparent resize-none p-4 text-sm font-mono text-zinc-300 focus:outline-none placeholder:text-zinc-600"
                        placeholder="openapi: 3.0.0&#10;info:&#10;  title: Sample API&#10;  version: 1.0.0&#10;paths:&#10;  /users:&#10;    get:&#10;      summary: Returns a list of users..."
                        spellCheck={false}
                      />
                    </div>
                  )}
                  
                  {/* Overlay if scanning */}
                  {scanStep !== 'idle' && (
                    <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <div className="w-16 h-16 relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <Shield className="w-6 h-6 text-emerald-500 absolute" />
                      </div>
                      
                      <div className="h-8 overflow-hidden relative w-64 text-center">
                        <AnimatePresence mode="wait">
                          {scanStep === 'ingesting' && (
                            <motion.p key="ingesting" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-zinc-100 font-medium absolute w-full">Ingesting schema definitions...</motion.p>
                          )}
                          {scanStep === 'static' && (
                            <motion.p key="static" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-zinc-100 font-medium absolute w-full">Running static OWASP rules...</motion.p>
                          )}
                          {scanStep === 'ai' && (
                            <motion.p key="ai" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-blue-400 font-medium absolute w-full">Executing AI Heuristics layer...</motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="border-t border-zinc-800 bg-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto relative z-20">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <AlertCircle className="w-4 h-4" />
                    Specs are analyzed ephemerally and never stored.
                  </div>
                  <button 
                    onClick={handleRunAudit}
                    disabled={scanStep !== 'idle'}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] ${scanStep !== 'idle' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700 shadow-none' : 'bg-emerald-500 hover:bg-emerald-400 text-oled emerald-glow'}`}
                  >
                    <Play className="w-4 h-4" fill="currentColor" /> {scanStep !== 'idle' ? 'Analyzing...' : 'Run Audit'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function ResultsDashboard({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col w-full h-full bg-surface"
    >
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <div>
          <h2 className="text-xl font-medium text-zinc-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Audit Complete
          </h2>
          <p className="text-sm text-zinc-500 mt-1 font-mono">Analyzed 14 endpoints in 4.12s</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full text-xs font-semibold border border-rose-500/20">1 Critical</span>
            <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/20">1 Warning</span>
          </div>
          <button 
            onClick={onReset}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors ml-4"
          >
            New Scan
          </button>
        </div>
      </div>

      <div className="p-6 flex-grow overflow-y-auto space-y-6">
        
        {/* BOLA Vulnerability Card */}
        <div className="border border-rose-500/30 bg-rose-500/5 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-rose-500/20 p-2 rounded-lg border border-rose-500/30">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-zinc-100 font-medium text-lg">Broken Object Level Authorization (BOLA)</h3>
                <span className="text-xs font-mono text-zinc-500 bg-surface px-2 py-1 rounded border border-zinc-800">OWASP API1:2023</span>
              </div>
              
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed max-w-3xl">
                The endpoint <code className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">GET /api/v1/users/&#123;id&#125;</code> retrieves sensitive user data but fails to validate if the authenticated user has permission to access the requested resource ID.
              </p>
              
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" /> AI Remediation Patch (Express.js)
                </div>
                <div className="bg-oled rounded-xl p-4 border border-zinc-800 font-mono text-[13px] leading-loose overflow-x-auto shadow-inner">
                  <div className="text-zinc-500 mb-2">{'// Add resource ownership validation before database query'}</div>
                  <div className="text-zinc-300">app.get('/api/v1/users/:id', authenticateToken, async (req, res) =&gt; &#123;</div>
                  <div className="text-emerald-400 bg-emerald-500/10 -mx-4 px-4 py-1 border-l-2 border-emerald-500 flex"><span className="w-6 text-zinc-500 select-none">+</span>  const requestedId = req.params.id;</div>
                  <div className="text-emerald-400 bg-emerald-500/10 -mx-4 px-4 py-1 border-l-2 border-emerald-500 flex"><span className="w-6 text-zinc-500 select-none">+</span>  if (req.user.id !== requestedId && !req.user.roles.includes('admin')) &#123;</div>
                  <div className="text-emerald-400 bg-emerald-500/10 -mx-4 px-4 py-1 border-l-2 border-emerald-500 flex"><span className="w-6 text-zinc-500 select-none">+</span>    return res.status(403).json(&#123; error: "Forbidden: Access denied to this resource" &#125;);</div>
                  <div className="text-emerald-400 bg-emerald-500/10 -mx-4 px-4 py-1 border-l-2 border-emerald-500 flex"><span className="w-6 text-zinc-500 select-none">+</span>  &#125;</div>
                  <div className="text-zinc-300 flex"><span className="w-6 text-zinc-500 select-none"> </span>  const user = await db.users.findById(req.params.id);</div>
                  <div className="text-zinc-300 flex"><span className="w-6 text-zinc-500 select-none"> </span>  res.json(user);</div>
                  <div className="text-zinc-300 flex"><span className="w-6 text-zinc-500 select-none"> </span>&#125;);</div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Create Jira Ticket
                </button>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Full Trace
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mass Assignment Card */}
        <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-zinc-100 font-medium text-lg">Mass Assignment Risk</h3>
                <span className="text-xs font-mono text-zinc-500 bg-surface px-2 py-1 rounded border border-zinc-800">OWASP API3:2023</span>
              </div>
              <p className="text-zinc-400 text-sm max-w-3xl">
                The <code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">UserUpdate</code> schema in <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">PATCH /api/v1/users/&#123;id&#125;</code> allows binding to administrative fields. Ensure fields like `role` or `isAdmin` are explicitly ignored in your ORM or define a strict allowlist schema.
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
