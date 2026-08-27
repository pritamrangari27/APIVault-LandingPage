import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Privacy() {
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
        
        <h1 className="text-4xl font-medium tracking-tight mb-8 pb-6 border-b border-white/10">Privacy Policy</h1>

        <div className="prose prose-invert prose-emerald max-w-none text-zinc-400 font-light leading-relaxed">
          <p className="mb-6">Last updated: August 27, 2026</p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">1. Information We Collect</h2>
          <p className="mb-6">
            APIVault prioritizes your privacy. When you upload your OpenAPI specifications to our platform, we only process the schema to provide security analysis. We do not store your API specifications persistently after the analysis is complete unless you explicitly opt-in to history tracking.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">2. How We Use Your Data</h2>
          <p className="mb-6">
            We use the information we collect primarily to provide, maintain, protect, and improve our current security engine. Your OpenAPI specs are processed in-memory by our Java and Python engines and are flushed immediately upon report generation.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">3. Data Security</h2>
          <p className="mb-6">
            We implement industry-standard security measures to ensure the safety of your API designs. All data transmitted to APIVault is encrypted in transit using TLS 1.3, and any opted-in stored data is encrypted at rest using AES-256.
          </p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">4. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, please contact us at privacy@apivault.com.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
