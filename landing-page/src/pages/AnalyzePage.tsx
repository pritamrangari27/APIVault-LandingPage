import { useState } from 'react';
import { ArrowLeft, UploadCloud, Code, FileCode2, Play, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isScanning, setIsScanning] = useState(false);

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
          <h1 className="text-3xl font-medium tracking-tight mb-2">Analyze API Specification</h1>
          <p className="text-zinc-400 font-light">Upload your OpenAPI/Swagger definition to instantly identify structural and logic flaws.</p>
        </div>

        <div className="flex-grow flex flex-col bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-[#050505]">
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
          <div className="flex-grow p-8 flex flex-col items-center justify-center min-h-[400px] relative">
            {activeTab === 'upload' ? (
              <div className="w-full max-w-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors bg-white/[0.02] cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                  <FileCode2 className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">Drag & Drop your API Spec</h3>
                <p className="text-sm text-zinc-500 font-light max-w-md mb-6">
                  Supports OpenAPI v2.0, v3.0, and v3.1 in JSON or YAML format. Maximum file size: 50MB.
                </p>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#0C0C0C]">
                <div className="bg-[#151515] border-b border-white/5 px-4 py-2 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 font-mono">openapi.yaml</div>
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                  </div>
                </div>
                <textarea 
                  className="flex-grow w-full bg-transparent resize-none p-4 text-sm font-mono text-zinc-300 focus:outline-none placeholder:text-zinc-700"
                  placeholder="openapi: 3.0.0&#10;info:&#10;  title: Sample API&#10;  version: 1.0.0&#10;paths:&#10;  /users:&#10;    get:&#10;      summary: Returns a list of users..."
                  spellCheck={false}
                />
              </div>
            )}
            
            {/* Overlay if scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-b-2xl">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-200 font-medium animate-pulse">Running deterministic analysis...</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="border-t border-white/5 bg-[#050505] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <AlertCircle className="w-4 h-4" />
              Specs are analyzed ephemerally and never stored.
            </div>
            <button 
              onClick={() => setIsScanning(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-oled px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
            >
              <Play className="w-4 h-4" fill="currentColor" /> Run Audit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
