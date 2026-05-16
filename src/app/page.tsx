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
              Ready to start mapping<br />your family story?
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-lg mx-auto">
              Create an account securely to save your family tree in the cloud, syncing instantly across all your devices.
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
        <footer className="py-12 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-bold text-white tracking-wider uppercase text-sm" style={{ fontFamily: '"Playfair Display", serif' }}>
                  Kinfolk
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                Built with love
              </p>
              <span className="text-sm text-neutral-500">&copy; 2026 Kinfolk</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
