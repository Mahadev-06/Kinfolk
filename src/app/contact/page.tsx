import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Kinfolk',
  description: 'Get in touch with the Kinfolk team for support, feedback, or inquiries.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 relative z-[1] animate-page-slide-up">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">Contact Us</h1>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              Have questions about building your family tree? Encountered an issue? Or just want to share your feedback with us? We'd love to hear from you.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <p className="text-neutral-400">
                  <a href="mailto:patromahadev544@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">patromahadev544@gmail.com</a>
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">WhatsApp</h3>
                <p className="text-neutral-400">
                  <a href="https://wa.me/917978933364" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">+91 79789 33364</a>
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Social</h3>
                <p className="text-neutral-400">
                  <a href="https://www.instagram.com/__.mahadev.__6?utm_source=qr&igsh=MWQxMWllZmJhYzd4Mg==" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Instagram</a>
                </p>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-xl text-white font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-1">Name</label>
                  <input type="text" id="name" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                  <input type="email" id="email" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" placeholder="How can we help?"></textarea>
                </div>
                <button type="button" className="w-full bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-neutral-200 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
