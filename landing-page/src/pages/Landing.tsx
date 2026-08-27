import React from 'react';
import { Shield, Search, FileCode2, ArrowRight, Activity, Code2, AlertCircle, Layers, Cpu, Terminal, GitBranch, CheckCircle2, FileText, Bell } from 'lucide-react';
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
            <Link to="/analyze" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-oled px-6 py-3 rounded-xl text-sm font-semibold transition-all emerald-glow">
              Analyze API Spec
              <ArrowRight className="w-4 h-4" />
            </Link>
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
                className="absolute top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-1/3 bg-[#0A0A0A] border border-rose-500/30 shadow-2xl rounded-xl p-4 w-[90%] sm:w-[320px] backdrop-blur-xl z-20"
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
              to="/feature/owasp"
            />
            <FeatureCard 
              icon={<Code2 className="w-5 h-5 text-emerald-500" />}
              title="Static Rule Engine"
              description="Fast, deterministic engine written in Java Spring Boot that runs against the spec structure instantly with zero false positives."
              highlight={true}
              to="/feature/static-engine"
            />
            <FeatureCard 
              icon={<Search className="w-5 h-5 text-blue-400" />}
              title="AI Judgment Layer"
              description="Python heuristic service that evaluates business logic flaws and generates context-aware remediation code."
              to="/feature/ai-judgment"
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
      
      {/* Vulnerability Coverage Section */}
      <section className="py-24 px-6 relative z-10 bg-oled border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Comprehensive Coverage</h2>
              <p className="text-zinc-400 font-light text-lg mb-10">
                We go beyond standard SAST/DAST tools by understanding your API's business logic, discovering complex authorization bypasses and data exposure risks.
              </p>
              <div className="space-y-6">
                <CoverageItem title="Broken Object Level Auth (BOLA)" description="Detects when endpoints fail to validate object ownership, preventing data leakage across tenants." />
                <CoverageItem title="Mass Assignment" description="Identifies models vulnerable to unauthorized property binding during creation or updates." />
                <CoverageItem title="Excessive Data Exposure" description="Flags responses that leak sensitive user data unintentionally by analyzing response schemas." />
                <CoverageItem title="Broken Function Level Auth" description="Finds privileged administrative endpoints accessible by standard user roles." />
              </div>
            </div>
            <div className="md:w-1/2 w-full relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent blur-3xl" />
               <div className="premium-card p-6 md:p-8 border-white/10 bg-[#0C0C0C] shadow-2xl relative z-10 rounded-2xl">
                 <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                    <div className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-zinc-400" />
                      OWASP API Security Top 10
                    </div>
                    <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">98% Coverage</div>
                 </div>
                 <div className="space-y-5">
                    <CoverageBar name="API1:2023 - BOLA" percent={100} />
                    <CoverageBar name="API2:2023 - Broken Authentication" percent={95} />
                    <CoverageBar name="API3:2023 - BOPA" percent={100} />
                    <CoverageBar name="API4:2023 - Unrestricted Resource Cons." percent={90} />
                    <CoverageBar name="API5:2023 - BFLA" percent={98} />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-6 relative z-10 bg-[#0A0A0A] border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Seamless CI/CD Integration</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light text-lg">Shift left without slowing down. APIVault integrates natively into your existing workflows, blocking vulnerable PRs instantly.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <IntegrationBadge name="GitHub Actions" icon={<GitBranch className="w-5 h-5" />} color="text-zinc-100" />
            <IntegrationBadge name="GitLab CI" icon={<GitBranch className="w-5 h-5" />} color="text-orange-400" />
            <IntegrationBadge name="Jenkins" icon={<Terminal className="w-5 h-5" />} color="text-red-400" />
            <IntegrationBadge name="CircleCI" icon={<Activity className="w-5 h-5" />} color="text-zinc-100" />
            <IntegrationBadge name="Bitbucket" icon={<GitBranch className="w-5 h-5" />} color="text-blue-400" />
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-24 px-6 relative z-10 bg-oled border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Automated Compliance Reporting</h2>
            <p className="text-zinc-400 font-light text-lg mb-8">
              Generate auditor-ready reports in seconds. We automatically map API vulnerabilities to major regulatory frameworks, saving your team hundreds of manual hours.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ComplianceBadge name="SOC 2 Type II" />
              <ComplianceBadge name="HIPAA" />
              <ComplianceBadge name="GDPR" />
              <ComplianceBadge name="PCI-DSS v4.0" />
            </div>
            <button className="mt-8 flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group">
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" /> Download Sample Report
            </button>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="premium-card p-6 border-white/10 bg-[#0C0C0C] relative overflow-hidden group shadow-2xl rounded-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-32 h-32 text-emerald-500" />
              </div>
              <h3 className="text-zinc-100 font-medium mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Compliance Checklist Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">Data Encryption in Transit</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">Strong Authentication Mechanisms</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">Access Control (BOLA/BFLA)</span>
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium bg-rose-500/10 px-2 py-1 rounded">
                    <AlertCircle className="w-3 h-3" /> 2 ISSUES
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3">
                  <span className="text-zinc-400 text-sm">Audit Logging Capabilities</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alerting Section */}
      <section className="py-24 px-6 relative z-10 bg-[#0A0A0A] border-t border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Real-time Alerting & Remediation</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light text-lg mb-16">
              When a critical vulnerability is detected, APIVault alerts the right team immediately with full context, payload traces, and AI-generated remediation patches.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <AlertingFeature 
                icon={<Bell className="w-5 h-5 text-indigo-400" />}
                title="Instant Notifications"
                description="Route alerts via Slack, Microsoft Teams, or PagerDuty based on severity and endpoint ownership."
              />
              <AlertingFeature 
                icon={<Layers className="w-5 h-5 text-blue-400" />}
                title="Jira Auto-Ticketing"
                description="Automatically create Jira tickets containing vulnerability details, CVSS scores, and reproduction steps."
              />
              <AlertingFeature 
                icon={<Cpu className="w-5 h-5 text-purple-400" />}
                title="AI Auto-Fixes"
                description="Generate ready-to-merge pull requests with fixes for common flaws like missing authorization checks."
              />
            </div>
         </div>
      </section>


    </>
  );
}

function ComplianceBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-emerald-500/30 transition-colors">
      <span className="text-zinc-300 text-sm font-medium">{name}</span>
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </div>
  );
}

function AlertingFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="premium-card p-6 flex flex-col text-left group border-white/5 hover:border-white/10 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-zinc-100 font-medium mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm font-light leading-relaxed">{description}</p>
    </div>
  );
}

function IntegrationBadge({ name, icon, color }: { name: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 hover:bg-[#151515] transition-all cursor-pointer group shadow-lg">
      <div className={`${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-zinc-300 font-medium text-sm">{name}</span>
    </div>
  );
}

function CoverageItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1 w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500/20 transition-colors">
        <div className="w-2 h-2 rounded-full bg-rose-500 group-hover:shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all" />
      </div>
      <div>
        <h4 className="text-zinc-100 font-medium text-sm mb-1">{title}</h4>
        <p className="text-zinc-500 text-sm font-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function CoverageBar({ name, percent }: { name: string, percent: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-zinc-400 mb-2">
        <span className="font-medium text-zinc-300">{name}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="h-full bg-rose-500/80 rounded-full relative" 
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
        </motion.div>
      </div>
    </div>
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
