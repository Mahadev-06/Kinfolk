'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function SignupContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      setError('Database connection is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push(redirectTo || '/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative z-10 pointer-events-auto">
      
      {/* Top Logo */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2.5 z-50">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-logo font-bold text-sm tracking-wider uppercase">Kinfolk</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="bg-night-card backdrop-blur-3xl border border-white/[0.08] p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* subtle interior glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-white/[0.03] blur-[50px] rounded-full pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-neutral-400 text-sm">
              Your family tree safely stored in the cloud.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-300 bg-red-950/40 border border-red-500/20 rounded-xl text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/[0.08] rounded-xl focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 text-white placeholder:text-neutral-600 transition-all"
                placeholder="pedro@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/[0.08] rounded-xl focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 text-white placeholder:text-neutral-600 transition-all"
                placeholder="At least 6 characters"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500 relative z-10">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
