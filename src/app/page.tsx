'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import DemoPreview from '@/components/landing/DemoPreview';
import BackgroundWaves from '@/components/landing/BackgroundWaves';
import Navbar from '@/components/shared/Navbar';
import GlassButton from '@/components/shared/GlassButton';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <Navbar />
      <BackgroundWaves />
      <main className="relative z-[1] animate-page-slide-up">
        {/* Hero: Full-viewport dark section */}
        <Hero />

        {/* Features: Black background with scroll-stacking cards */}
        <Features />

        {/* Demo Preview: Dark section with embedded canvas */}
        <DemoPreview />

        {/* CTA Section */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.15] sm:leading-[1.1]">
              {user ? (
                <>Welcome back to<br />your family tree</>
              ) : (
                <>Ready to start mapping<br />your family story?</>
              )}
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-lg mx-auto">
              {user ? (
                "Check your dashboard to view, manage, and continue building all your saved family trees."
              ) : (
                "Create an account securely to save your family tree in the cloud, syncing instantly across all your devices."
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               {user ? (
                 <GlassButton href="/dashboard">Go to Dashboard</GlassButton>
               ) : (
                 <>
                   <GlassButton href="/signup">Create Account</GlassButton>
                   <GlassButton href="/login">Sign In</GlassButton>
                 </>
               )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] bg-black">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
            
            {/* Top section: Logo + Contact */}
            <div className="py-8 sm:py-14 flex flex-row items-start justify-between gap-4 sm:gap-8">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <img src="/logo.png" alt="Kinfolk Logo" className="w-14 h-14 sm:w-20 sm:h-20 object-contain invert opacity-90" />
              </div>

              {/* Contact Links */}
              <div className="flex flex-col items-end gap-4 sm:gap-5">
                <h3 className="text-xs font-semibold text-white/70 tracking-[0.2em] uppercase">Contact</h3>
                <div className="flex flex-col items-end gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-neutral-500">
                  <a 
                    href="https://www.instagram.com/__.mahadev.__6?utm_source=qr&igsh=MWQxMWllZmJhYzd4Mg==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group transition-colors duration-300 flex items-center gap-2.5 hover:text-[#E1306C]"
                  >
                    <span className="w-5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Instagram
                  </a>
                  <a 
                    href="https://wa.me/917978933364" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group transition-colors duration-300 flex items-center gap-2.5 hover:text-[#25D366]"
                  >
                    <span className="w-5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    WhatsApp
                  </a>
                  <a 
                    href="mailto:patromahadev544@gmail.com" 
                    className="group transition-colors duration-300 flex items-center gap-2.5 hover:text-[#EA4335]"
                  >
                    <span className="w-5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-[18px] h-[18px] text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </span>
                    Email
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar: Built with love */}
            <div className="border-t border-white/[0.06] py-6 flex items-center justify-center gap-1.5">
              <span className="text-xs text-neutral-500">Built with</span>
              <svg className="w-3.5 h-3.5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-neutral-600 ml-2">&copy; 2026 Kinfolk</span>
            </div>

          </div>
        </footer>
    </main>
    </>
  );
}
