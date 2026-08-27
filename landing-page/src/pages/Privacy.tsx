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
          <p className="mb-6"><strong>Effective Date:</strong> August 27, 2026</p>
          
          <p className="mb-8">
            This Privacy Policy describes how APIVault ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services (collectively, the "Service").
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, including:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, password, and other contact details.</li>
            <li><strong>Service Data:</strong> API specifications (e.g., OpenAPI, Swagger files), logs, and configurations submitted for analysis.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our Service, including IP addresses, browser types, pages viewed, and timestamps.</li>
          </ul>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">2. How We Use Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Provide, maintain, and improve our Service.</li>
            <li>Process and analyze your API specifications to deliver security reports.</li>
            <li>Communicate with you regarding updates, support, and promotional offers.</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
          </ul>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">3. Information Sharing and Disclosure</h2>
          <p className="mb-6">
            We do not sell your personal information. We may share your information with third-party vendors, consultants, and service providers who need access to such information to carry out work on our behalf (e.g., cloud hosting, analytics). We may also disclose information if required by law or to protect the rights and safety of APIVault, our users, or others.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">4. Data Retention and Security</h2>
          <p className="mb-6">
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. We retain personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by law. API specifications submitted for transient analysis are purged from our active processing systems immediately upon report generation unless you explicitly opt-in to historical tracking.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">5. Your Rights and Choices</h2>
          <p className="mb-6">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict its use. You can usually update your account information directly within the Service settings or by contacting us.
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">6. Changes to this Policy</h2>
          <p className="mb-6">
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you an email).
          </p>

          <h2 className="text-2xl font-medium text-zinc-100 mb-4 mt-8">7. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, please contact us at privacy@apivault.com.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
