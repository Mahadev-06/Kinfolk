import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Kinfolk',
  description: 'Terms of Service for Kinfolk family tree builder.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 relative z-[1] animate-page-slide-up">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">Terms of Service</h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm text-neutral-300">
            <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">By accessing and using Kinfolk ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-6">Kinfolk is a cloud-based family tree building application that allows users to map, save, and visualize their family history and lineage.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Accounts</h2>
            <p className="mb-6">To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account or password.</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Content</h2>
            <p className="mb-6">You retain all rights to the family tree data, images, and other content you upload to Kinfolk. By using our Service, you grant us a license to host and store this content solely for the purpose of providing the Service to you.</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Privacy</h2>
            <p className="mb-6">Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms of Service.</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Modifications to Service</h2>
            <p className="mb-6">We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Contact Information</h2>
            <p className="mb-6">If you have any questions about these Terms, please contact us at <a href="mailto:patromahadev544@gmail.com" className="text-blue-400 hover:underline">patromahadev544@gmail.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
