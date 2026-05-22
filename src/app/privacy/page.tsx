import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Kinfolk',
  description: 'Privacy Policy for Kinfolk family tree builder.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 relative z-[1] animate-page-slide-up">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">Privacy Policy</h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm text-neutral-300">
            <p className="mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <p className="mb-6 text-lg">At Kinfolk, we understand that family history is deeply personal. We are committed to protecting your privacy and ensuring that your data remains secure.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us when using the Service:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Account Information:</strong> When you register, we collect your email address and authentication credentials via Supabase.</li>
              <li><strong>Family Tree Data:</strong> Names, dates, relationships, and other genealogical data you enter to build your family tree.</li>
              <li><strong>Usage Data:</strong> Basic information about how you interact with our application to help us improve the user experience.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide, maintain, and improve the Kinfolk service.</li>
              <li>Securely store your family tree data so you can access it from any device.</li>
              <li>Respond to your comments, questions, and customer service requests.</li>
              <li>Send you technical notices, updates, and administrative messages.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Storage and Security</h2>
            <p className="mb-6">Your data is stored securely using modern cloud infrastructure. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Sharing Your Information</h2>
            <p className="mb-6">We do not sell, trade, or rent your personal information to third parties. Your family tree data is private to your account unless you explicitly choose to share it.</p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Your Data Rights</h2>
            <p className="mb-6">You have the right to access, update, or delete your information at any time. If you wish to delete your account and all associated family tree data, you can do so from your account settings or by contacting us.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
            <p className="mb-6">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:patromahadev544@gmail.com" className="text-blue-400 hover:underline">patromahadev544@gmail.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
