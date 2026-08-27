import React from 'react';
import { Shield, Search, FileCode2, ArrowRight, Activity, Code2, AlertCircle, Layers, Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
        {/* Subtle background gradient mesh */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
          

          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05] mb-6 max-w-4xl"
          >
            Deterministic security <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 glow-text">for modern APIs.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 font-light"
          >
            Upload your OpenAPI spec. Our dual-layer engine combines OWASP static rules with AI heuristics to catch structural flaws and business logic vulnerabilities instantly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-oled px-6 py-3 rounded-xl text-sm font-semibold transition-all emerald-glow">
              Analyze API Spec
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
              to="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-100 px-6 py-3 rounded-xl text-sm font-medium transition-all"
            >
              Read Documentation
            </Link>
          </motion.div>
        </div>

        {/* IDE Signature Element */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-24 relative z-10"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0C0C0C] overflow-hidden shadow-2xl flex flex-col font-mono text-sm leading-relaxed text-zinc-300">
            {/* IDE Header */}
            <div className="h-12 bg-[#050505] border-b border-white/5 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>
                <div className="flex bg-[#0C0C0C] border-t border-x border-white/5 px-4 py-1.5 rounded-t-lg items-center gap-2 translate-y-[6px]">
                  <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-200">openapi.json</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs">
                  <Activity className="w-3 h-3" />
                  <span>Audit Complete</span>
                </div>
              </div>
            </div>
            
            {/* IDE Body */}
            <div className="flex flex-1 p-4 relative">
              {/* Line Numbers */}
              <div className="flex flex-col text-right w-8 text-zinc-700 select-none mr-6 text-xs">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
              </div>
              
              {/* Code Area */}
              <div className="flex-1 text-xs sm:text-sm overflow-x-auto whitespace-pre">
                <div><span className="text-zinc-500">"paths"</span>: &#123;</div>
                <div>  <span className="text-blue-400">"/users/&#123;id&#125;"</span>: &#123;</div>
                <div>    <span className="text-emerald-400">"get"</span>: &#123;</div>
                <div>      <span className="text-zinc-500">"summary"</span>: <span className="text-amber-300">"Get user profile"</span>,</div>
                <div className="relative">
                  <span className="absolute -left-12 w-[200%] h-full bg-rose-500/10 pointer-events-none" />
                  <span className="relative z-10">      <span className="text-zinc-500">"security"</span>: []</span>
                </div>
                <div>    &#125;</div>
                <div>  &#125;,</div>
                <div>  <span className="text-blue-400">"/admin/metrics"</span>: &#123;</div>
                <div>    <span className="text-emerald-400">"post"</span>: &#123; <span className="text-zinc-600">...</span> &#125;</div>
              </div>

              {/* Vulnerability Popover */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="absolute top-24 left-1/4 md:left-1/3 bg-[#0A0A0A] border border-rose-500/30 shadow-2xl rounded-xl p-4 w-[280px] sm:w-[320px] backdrop-blur-xl z-20"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-sans font-medium text-sm mb-1">Broken Object Level Auth</h4>
                    <p className="text-zinc-400 font-sans text-xs leading-relaxed mb-3">
                      Endpoint <code className="text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded">GET /users/&#123;id&#125;</code> exposes resources without validating ownership parameters.
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-md font-sans transition-colors">
                        View Trace
                      </button>
                      <button className="bg-rose-500 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-md font-sans font-medium transition-colors">
                        Auto-Fix
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10 bg-oled border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Enterprise Grade Scanning</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light text-lg">Our two-layer analysis catches structural problems deterministically, and complex logic flaws using AI.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Shield className="w-5 h-5 text-zinc-400" />}
              title="OWASP Framework"
              description="Automatically maps findings to the OWASP API Top 10, including BOLA, mass assignment, and excessive data exposure."
            />
            <FeatureCard 
              icon={<Code2 className="w-5 h-5 text-emerald-500" />}
              title="Static Rule Engine"
              description="Fast, deterministic engine written in Java Spring Boot that runs against the spec structure instantly with zero false positives."
              highlight={true}
            />
            <FeatureCard 
              icon={<Search className="w-5 h-5 text-blue-400" />}
              title="AI Judgment Layer"
              description="Python heuristic service that evaluates business logic flaws and generates context-aware remediation code."
            />
          </div>
        </div>
      </section>

      {/* Engine Sequence Section */}
      <section id="how-it-works" className="py-24 px-6 relative z-10 bg-oled border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Dual-layer Engine</h2>
              <p className="text-zinc-400 font-light text-lg mb-8">
                A sequential pipeline that processes your API spec with uncompromising precision. Fast enough for CI/CD, smart enough for business logic.
              </p>
              
              <div className="rounded-xl border border-white/10 bg-[#050505] p-4 font-mono text-[11px] sm:text-xs text-zinc-400 leading-relaxed overflow-hidden relative h-[180px]">
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
                <div className="flex gap-2 mb-3 items-center text-zinc-500 border-b border-white/5 pb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>engine.log</span>
                </div>
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: -120 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="space-y-1.5 opacity-80"
                >
                  <div className="text-emerald-400">[info] Initialize APIVault v2.0</div>
                  <div>[info] Loading openapi.json (4.2MB)</div>
                  <div>[info] Parsing 124 endpoints...</div>
                  <div>[info] Normalizing schema definitions</div>
                  <div className="text-emerald-400">[info] Ingestion complete (42ms)</div>
                  <div>[info] Running OWASP Rule Engine...</div>
                  <div className="text-amber-400">[warn] Unauthenticated route: /metrics</div>
                  <div>[info] Static analysis complete (105ms)</div>
                  <div>[info] Running AI Heuristics Engine...</div>
                  <div className="text-rose-400">[crit] BOLA vulnerability found in /users/&#123;id&#125;</div>
                  <div>[info] Generating remediation patch</div>
                  <div className="text-emerald-400">[info] Audit complete. 1 issue found.</div>
                  <br/>
                  <div className="text-emerald-400">[info] Initialize APIVault v2.0</div>
                  <div>[info] Loading openapi.json (4.2MB)</div>
                  <div>[info] Parsing 124 endpoints...</div>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500/20 via-white/10 to-transparent hidden md:block" />
            
            <div className="space-y-12">
              <StepCard 
                number="01"
                title="Schema Ingestion"
                description="We parse your OpenAPI / Swagger spec, normalizing endpoints, parameters, and security schemes into our internal graph representation."
                icon={<Layers className="w-5 h-5 text-zinc-400" />}
              />
              <StepCard 
                number="02"
                title="Deterministic Static Analysis"
                description="Our Java Spring engine evaluates the graph against hundreds of structural rules mapped to the OWASP API Security Top 10. Guaranteed zero false positives."
                icon={<Code2 className="w-5 h-5 text-emerald-500" />}
              />
              <StepCard 
                number="03"
                title="AI Heuristic Judgement"
                description="A Python-based AI layer analyzes the context of your endpoints for complex business logic flaws like Broken Object Level Authorization (BOLA)."
                icon={<Cpu className="w-5 h-5 text-blue-400" />}
              />
              <StepCard 
                number="04"
                title="Remediation Output"
                description="Actionable findings are returned instantly with exact line numbers and auto-fix code snippets that can be merged directly into your repository."
                icon={<Terminal className="w-5 h-5 text-purple-400" />}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-medium tracking-tight mb-6">Ready to secure your endpoints?</h2>
          <p className="text-zinc-400 mb-10 text-lg font-light">Integrate APIVault into your CI/CD pipeline and block vulnerabilities before they ever reach production.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-zinc-100 hover:bg-white text-oled px-8 py-3 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]">
              Start Free Trial
            </button>
            <button className="bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-100 px-8 py-3 rounded-full text-sm font-medium transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description, to = "/docs", highlight = false }: { icon: React.ReactNode, title: string, description: string, to?: string, highlight?: boolean }) {
  return (
    <div className={`premium-card p-6 flex flex-col h-full group ${highlight ? 'border-emerald-500/20' : ''}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 border transition-colors ${highlight ? 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20' : 'bg-zinc-900 border-white/5 group-hover:border-white/10'}`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed font-light flex-1 mb-6">{description}</p>
      <Link to={to} className="mt-auto flex items-center text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors cursor-pointer w-fit">
        Explore feature <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </Link>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="relative md:pl-20 group">
      {/* Node on the line */}
      <div className="absolute left-[23px] top-8 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0C0C0C] border border-zinc-600 group-hover:border-emerald-500 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 hidden md:block z-10" />
      
      <div className="premium-card p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden border-l-2 border-l-transparent group-hover:border-l-emerald-500 transition-all duration-300">
        {/* Subtle hover gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex-shrink-0 pt-1">
          <div className="text-xs font-mono text-zinc-500 mb-3">{number}</div>
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-300">
            {icon}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-zinc-100 mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-light">{description}</p>
        </div>
      </div>
    </div>
  );
}
