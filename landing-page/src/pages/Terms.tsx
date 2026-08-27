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
          <p className="mb-6"><strong>Effective Date:</strong> August 27, 2026</p>

          <p className="mb-8">
            Please read these Terms of Service ("Terms") carefully before using the APIVault website and platform (the "Service") operated by APIVault ("us", "we", or "our").
          </p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">2. User Accounts</h2>
          <p className="mb-6">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">3. Acceptable Use and Submissions</h2>
          <p className="mb-6">
            You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You retain all of your ownership rights in your API specifications and data ("User Content"). By submitting User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and process the User Content solely to provide the Service to you (e.g., analyzing it for vulnerabilities). You warrant that you have all necessary rights to upload and process this data.
          </p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">4. Intellectual Property</h2>
          <p className="mb-6">
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of APIVault and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">5. Termination</h2>
          <p className="mb-6">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">6. Limitation of Liability</h2>
          <p className="mb-6">
            In no event shall APIVault, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) unauthorized access, use, or alteration of your transmissions or content.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">7. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">8. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms, please contact us at legal@apivault.com.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
