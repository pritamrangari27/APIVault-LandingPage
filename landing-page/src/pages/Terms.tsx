import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto flex-grow">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-medium tracking-tight mb-8 pb-6 border-b border-white/10">Terms of Service</h1>

        <div className="prose prose-invert prose-emerald max-w-none text-zinc-400 font-light leading-relaxed">
          <p className="mb-6">Last updated: August 27, 2026</p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using the APIVault platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">2. Use License</h2>
          <p className="mb-6">
            Permission is granted to temporarily use the materials and analysis tools on APIVault's website for personal, non-commercial, or internal commercial evaluation. This is the grant of a license, not a transfer of title, and under this license you may not attempt to decompile or reverse engineer any software contained on the platform.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">3. API Submissions</h2>
          <p className="mb-6">
            You retain all rights to the API specifications you submit for analysis. You grant APIVault a temporary license to parse and analyze your specs solely for the purpose of generating your security report. You warrant that you have the legal right to upload and test the provided API specifications.
          </p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">4. Limitations</h2>
          <p className="mb-6">
            In no event shall APIVault or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on APIVault's website.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
