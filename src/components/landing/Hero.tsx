import { motion } from 'framer-motion';
import DecryptedText from '@/components/shared/DecryptedText';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Hero() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">


      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-400 border border-white/[0.1] rounded-full px-5 py-2 backdrop-blur-sm bg-white/[0.03]">
            100% Secure · Cloud Synced
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-7 leading-[1.15] sm:leading-[1.1] text-white"
        >
          {['Turn', 'your', 'family'].map((word, i) => (
            <span key={`l1-${i}`} className="inline-block mr-[0.25em] last:mr-0">
              <DecryptedText 
                text={word}
                animateOn="view"
                speed={70}
                maxIterations={16}
                delay={i * 350}
                encryptedClassName="text-neutral-500 font-mono"
              />
            </span>
          ))}
          <br className="hidden sm:block" />
          {['into', 'a', 'living', 'map.'].map((word, i) => (
            <span key={`l2-${i}`} className="inline-block mr-[0.25em] last:mr-0">
              <DecryptedText 
                text={word}
                animateOn="view"
                speed={70}
                maxIterations={16}
                delay={(3 + i) * 350}
                encryptedClassName="text-neutral-500 font-mono"
              />
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-lg sm:text-xl text-neutral-400 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Create stunning, interactive family trees with drag-and-drop simplicity. Your data is securely synced across all your devices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center gap-4"
        >
          {user ? (
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 px-10 py-3.5 rounded-2xl font-medium text-[15px] text-white cursor-pointer btn-liquid-glass"
            >
              <span className="relative z-10">Go to Dashboard</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.a>
          ) : (
            <>
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-medium text-[15px] text-white/90 cursor-pointer btn-liquid-glass"
                >
                  <span className="relative z-10">Sign In</span>
                </motion.a>

                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-medium text-[15px] text-white cursor-pointer btn-liquid-glass"
                >
                  <span className="relative z-10">Create Account</span>
                  <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
