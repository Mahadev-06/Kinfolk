'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import DemoPreview from '@/components/landing/DemoPreview';
import BackgroundWaves from '@/components/landing/BackgroundWaves';
import Navbar from '@/components/shared/Navbar';
import GlassButton from '@/components/shared/GlassButton';
import Footer from '@/components/shared/Footer';
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
        <Footer />
    </main>
    </>
  );
}
