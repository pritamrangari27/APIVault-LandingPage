import React, { useState } from 'react';
import { Shield, Search, FileCode2, ArrowRight, Activity, Code2, AlertCircle, Layers, Cpu, Terminal, GitBranch, CheckCircle2, FileText, Bell, MessageSquare, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
        {/* Subtle background gradient mesh */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">



          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[1.05] mb-4 flex justify-center">
            {"APIVault".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -12, 0],
                  color: ['#34d399', '#06b6d4', '#34d399'],
                  textShadow: ['0 0 20px rgba(52,211,153,0.3)', '0 0 40px rgba(6,182,212,0.6)', '0 0 20px rgba(52,211,153,0.3)']
                }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 },
                  color: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                  textShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                  opacity: { duration: 0.6, delay: index * 0.05 }
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-2xl md:text-4xl font-medium tracking-tight text-zinc-100 mb-6 max-w-4xl"
          >
            Deterministic security <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 glow-text">for modern APIs.</span>
          </motion.h2>

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
            <Link to="/analyze" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-oled px-6 py-3 rounded-xl text-sm font-semibold transition-all emerald-glow border border-border-subtle">
              Analyze API Spec
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 px-6 py-3 rounded-xl text-sm font-medium transition-all"
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
          <div className="rounded-2xl border border-zinc-800 bg-surface overflow-hidden shadow-2xl flex flex-col font-mono text-sm leading-relaxed text-zinc-300">
            {/* IDE Header */}
            <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>
                <div className="flex bg-surface border-t border-x border-zinc-800 px-4 py-1.5 rounded-t-lg items-center gap-2 translate-y-[6px]">
                  <FileCode2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-300">openapi.json</span>
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
                className="absolute top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-1/3 bg-surface border border-rose-500/30 shadow-2xl rounded-xl p-4 w-[90%] sm:w-[320px] backdrop-blur-xl z-20"
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
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-md font-sans transition-colors">
                        View Trace
                      </button>
                      <button className="bg-rose-500 hover:bg-rose-600 text-zinc-100 text-xs px-3 py-1.5 rounded-md font-sans font-medium transition-colors">
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
      <section id="features" className="py-24 px-6 relative z-10 bg-oled border-t border-zinc-800">
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
      <section id="how-it-works" className="py-24 px-6 relative z-10 bg-oled border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Dual-layer Engine</h2>
              <p className="text-zinc-400 font-light text-lg mb-8">
                A sequential pipeline that processes your API spec with uncompromising precision. Fast enough for CI/CD, smart enough for business logic.
              </p>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-[11px] sm:text-xs text-zinc-400 leading-relaxed overflow-hidden relative h-[180px]">
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-10" />
                <div className="flex gap-2 mb-3 items-center text-zinc-500 border-b border-zinc-800 pb-2">
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
                  <br />
                  <div className="text-emerald-400">[info] Initialize APIVault v2.0</div>
                  <div>[info] Loading openapi.json (4.2MB)</div>
                  <div>[info] Parsing 124 endpoints...</div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500/20 via-zinc-800 to-transparent hidden md:block" />

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
      <section className="py-24 px-6 relative z-10 bg-oled border-t border-zinc-800">
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
              <div className="premium-card p-6 md:p-8 border-zinc-800 bg-surface shadow-2xl relative z-10 rounded-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-6">
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



      {/* Compliance Section */}
      <section className="py-24 px-6 relative z-10 bg-oled border-t border-zinc-800">
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
            <div className="premium-card p-6 border-zinc-800 bg-surface relative overflow-hidden group shadow-2xl rounded-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-32 h-32 text-emerald-500" />
              </div>
              <h3 className="text-zinc-100 font-medium mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" /> Compliance Checklist Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-zinc-400 text-sm">Data Encryption in Transit</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-zinc-400 text-sm">Strong Authentication Mechanisms</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" /> PASS
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
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


      {/* Comparison Section */}
      <section className="py-24 px-6 relative z-10 bg-surface border-t border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-4">Why APIVault?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-light text-lg">See how we stack up against traditional DAST/SAST tools and manual pentesting.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-zinc-800 text-zinc-400 font-medium text-sm">Feature</th>
                  <th className="p-4 border-b border-zinc-800 text-emerald-400 font-medium text-sm bg-emerald-500/5 rounded-t-xl">APIVault</th>
                  <th className="p-4 border-b border-zinc-800 text-zinc-400 font-medium text-sm">Traditional DAST/SAST</th>
                  <th className="p-4 border-b border-zinc-800 text-zinc-400 font-medium text-sm">Manual Pentest</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-zinc-300">
                <tr className="border-b border-zinc-800/50 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-zinc-100">False Positive Rate</td>
                  <td className="p-4 bg-emerald-500/5 text-emerald-300 font-medium">
                    <Link to="/feature/static-engine" className="hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-4 transition-colors">Near Zero</Link>
                  </td>
                  <td className="p-4 text-zinc-500">High (Requires Triage)</td>
                  <td className="p-4 text-zinc-500">Low</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-zinc-100">CI/CD Speed</td>
                  <td className="p-4 bg-emerald-500/5 text-emerald-300 font-medium">Seconds (&lt;150ms)</td>
                  <td className="p-4 text-zinc-500">Minutes to Hours</td>
                  <td className="p-4 text-zinc-500">Weeks</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-zinc-100">Business Logic (BOLA)</td>
                  <td className="p-4 bg-emerald-500/5 text-emerald-300 font-medium">
                    <Link to="/feature/ai-judgment" className="hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-4 transition-colors">AI-Powered Detection</Link>
                  </td>
                  <td className="p-4 text-zinc-500">Poor / Missing</td>
                  <td className="p-4 text-zinc-500">Excellent</td>
                </tr>
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-medium text-zinc-100 rounded-bl-xl">Setup Time</td>
                  <td className="p-4 bg-emerald-500/5 text-emerald-300 font-medium rounded-br-xl border-b-0">Instant (No agents)</td>
                  <td className="p-4 text-zinc-500">Complex config</td>
                  <td className="p-4 text-zinc-500">Lengthy procurement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Open Source & Community Section */}
      <section className="py-24 px-6 relative z-10 bg-oled border-t border-zinc-800 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6 border border-emerald-500/20">
            <GitBranch className="w-4 h-4" /> Open Source First
          </div>
          <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-6">Backed by the Community</h2>
          <p className="text-zinc-400 font-light text-lg mb-10 max-w-2xl mx-auto">
            APIVault is built in the open. Join thousands of developers and security researchers who are redefining API security together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/Ioit-Project/apiVault" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-oled px-8 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]">
              <GitBranch className="w-5 h-5" />
              Star on GitHub
              <span className="bg-zinc-300/50 text-zinc-900 px-2 py-0.5 rounded text-xs ml-2 font-bold">1k+</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 relative z-10 bg-oled border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-6 border border-emerald-500/20">
                <Terminal className="w-4 h-4" /> root@apivault:~/faq
              </div>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-6">Common Queries</h2>
              <p className="text-zinc-500 font-light text-lg">
                Technical details about our engine, deployment, and data privacy.
              </p>
            </div>
          </div>
          <div className="md:w-2/3 border-b border-zinc-800/60">
            <FaqItem 
              index={1}
              question="Does my API spec data leave my network?" 
              answer="By default, yes, when using our cloud offering. However, APIVault offers an on-premise Enterprise deployment where everything runs within your own VPC. No data leaves your network."
            />
            <FaqItem 
              index={2}
              question="Which OpenAPI versions do you support?" 
              answer="We fully support OpenAPI 2.0 (Swagger), 3.0, and 3.1. We also have beta support for Postman Collections and GraphQL schemas."
            />
            <FaqItem 
              index={3}
              question="How long does a scan typically take in CI/CD?" 
              answer="Our static deterministic engine is incredibly fast, typically analyzing a 10MB spec in under 150ms. The AI heuristics layer adds roughly 2-5 seconds depending on the complexity of your endpoints."
            />
            <FaqItem 
              index={4}
              question="What is the difference between the static engine and AI heuristics?" 
              answer="The static engine uses strict, rules-based pattern matching (e.g., checking if security definitions exist). The AI heuristics layer understands the context of your API, looking for logical flaws like a normal user trying to access an admin endpoint (BOLA/BFLA)."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-32 px-6 relative z-10 bg-zinc-950 overflow-hidden border-t border-zinc-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Ready to secure your APIs?
          </h2>
          <p className="text-gray-400 font-light text-xl mb-10 max-w-2xl mx-auto">
            Analyze your OpenAPI spec in seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyze" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-4 rounded-xl text-base font-semibold transition-all emerald-glow border border-emerald-400/20 group">
              Start Scanning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

function ComplianceBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/30 transition-colors">
      <span className="text-zinc-300 text-sm font-medium">{name}</span>
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </div>
  );
}

function AlertingFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="premium-card p-6 flex flex-col text-left group border-zinc-800 hover:border-zinc-800 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-zinc-100 font-medium mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm font-light leading-relaxed">{description}</p>
    </div>
  );
}

function IntegrationBadge({ name, icon, color }: { name: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-hover border border-zinc-800 hover:border-zinc-800 hover:bg-zinc-800 transition-all cursor-pointer group shadow-lg">
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
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`premium-card p-8 flex flex-col h-full group relative overflow-hidden bg-surface ${highlight ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-all duration-300 ${highlight ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-300 group-hover:border-zinc-600 group-hover:text-emerald-400'}`}>
        {icon}
      </div>
      <h3 className="relative z-10 text-xl font-medium text-zinc-100 mb-3 group-hover:text-emerald-300 transition-colors duration-300">{title}</h3>
      <p className="relative z-10 text-zinc-400 text-sm leading-relaxed font-light flex-1 mb-8">{description}</p>
      <Link to={to} className="relative z-10 mt-auto flex items-center text-sm font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors cursor-pointer w-fit">
        Explore feature <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Link>
    </motion.div>
  );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ x: 8 }}
      transition={{ duration: 0.3 }}
      className="relative md:pl-20 group cursor-default"
    >
      {/* Node on the line */}
      <div className="absolute left-[23px] top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(52,211,153,0.6)] transition-all duration-300 hidden md:block z-10" />

      <div className="premium-card p-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden bg-surface border-l-2 border-l-zinc-800 group-hover:border-l-emerald-400 group-hover:bg-zinc-900 transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex-shrink-0 pt-1">
          <div className="text-xs font-mono text-zinc-500 mb-3 group-hover:text-emerald-500 transition-colors">{number}</div>
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
            {icon}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-zinc-100 mb-3 group-hover:text-emerald-300 transition-colors">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed font-light">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-t border-zinc-800/60 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-start gap-6 text-left focus:outline-none cursor-pointer"
      >
        <span className="font-mono text-xs text-zinc-600 mt-1">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <h3 className={`text-xl font-medium tracking-tight transition-colors duration-300 ${isOpen ? 'text-emerald-400' : 'text-zinc-100 group-hover:text-zinc-300'}`}>
            {question}
          </h3>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 text-zinc-400 text-base font-light leading-relaxed pr-8">
                  {answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:bg-zinc-800'}`}>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
      </button>
    </div>
  );
}


