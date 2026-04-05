'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import ConfirmDialog from './ConfirmDialog';

interface NavbarProps {
  showBack?: boolean;
  title?: string;
  rightActions?: React.ReactNode;
  hideHome?: boolean;
  isEditor?: boolean;
}

export default function Navbar({ showBack = false, title, rightActions, hideHome = false, isEditor = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isLanding = pathname === '/' || pathname === '' || pathname === '/dashboard';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    
    // Clear local state
    setUser(null);
    setShowLogoutConfirm(false);
    setIsMobileMenuOpen(false);

    // Force a hard redirect to the landing page to clean up all state
    window.location.href = '/';
  };

  return (
    <>
      {isLanding ? (
        <FloatingNavbar 
          user={user} 
          onSignOut={() => setShowLogoutConfirm(true)} 
          rightActions={rightActions}
          pathname={pathname}
        />
      ) : (
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            ${isEditor ? 'fixed top-3 inset-x-0 z-[100] pointer-events-none' : 'fixed top-0 inset-x-0 w-full z-[80] backdrop-blur-2xl bg-black/60 border-b border-white/[0.06] pointer-events-auto'}
          `}
        >
          <div className={`max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className={`flex items-center justify-between ${isEditor ? '' : 'h-16'}`}>
              {/* Left — Kinfolk branding */}
              <div className={`flex items-center gap-4 pointer-events-auto ${isEditor ? 'bg-night-card/90 backdrop-blur-2xl border border-white/[0.06] px-5 py-2.5 rounded-xl shadow-xl' : ''}`}>
                {showBack && (
                  <Link
                    href="/dashboard"
                    className="text-neutral-500 hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                )}
                <Link href="/" className="flex items-center gap-2.5">
                  <svg className="w-7 h-7 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-logo font-bold text-base text-white/90 tracking-wider uppercase">
                    Kinfolk
                  </span>
                </Link>
                {title && (
                  <span className="hidden sm:inline text-neutral-500 font-light text-sm">
                    / {title}
                  </span>
                )}
              </div>

              {/* Right — Actions & Auth (Desktop) */}
              <div className={`hidden md:flex items-center gap-3 justify-end pointer-events-auto`}>
                {rightActions}
                {user && !isEditor && (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="group inline-flex items-center p-2 rounded-full bg-white/[0.05] text-neutral-400 hover:bg-white/[0.1] hover:text-white transition-all duration-300 text-sm font-medium border border-white/[0.08]"
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 text-red-400">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-0 group-hover:max-w-[80px] group-hover:opacity-100">
                      <span className="pl-2 pr-1 inline-block">Logout</span>
                    </span>
                  </button>
                )}
                {!user && !hideHome && !isEditor && (
                  <Link
                    href="/"
                    className="group inline-flex items-center p-2 rounded-full bg-white/[0.05] text-neutral-400 hover:bg-white/[0.1] hover:text-white transition-all duration-300 text-sm font-medium border border-white/[0.08]"
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-0 group-hover:max-w-[80px] group-hover:opacity-100">
                      <span className="pl-2 pr-1 inline-block">Home</span>
                    </span>
                  </Link>
                )}
              </div>

              {/* Mobile Actions Toggle */}
              <div className="flex md:hidden items-center gap-2 pointer-events-auto">
                {rightActions}
                {!isEditor && (
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-white/[0.05] text-neutral-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Content */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden overflow-hidden bg-black/80 backdrop-blur-xl border-t border-white/5 py-4 space-y-4 pointer-events-auto"
                >
                  {user ? (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-medium hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  ) : !hideHome && (
                    <Link
                      href="/"
                      className="w-full flex items-center gap-3 px-4 py-3 text-white font-medium hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        onConfirm={handleSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}

function FloatingNavbar({ 
  user, 
  onSignOut, 
  rightActions,
  pathname
}: { 
  user: User | null; 
  onSignOut: () => void;
  rightActions?: React.ReactNode;
  pathname: string;
}) {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-4 sm:px-8 pt-4 pb-4 gap-4 pointer-events-none">
      {/* Brand on the Left */}
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 1] }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={scrollToTop}
        className="btn-liquid-glass rounded-2xl cursor-pointer select-none pointer-events-auto"
      >
        <div className="flex items-center justify-center gap-2.5 px-6 py-3 relative z-10">
          <svg className="w-6 h-6 text-white/90 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-logo font-bold text-base text-white/90 tracking-wider uppercase drop-shadow-sm">
            Kinfolk
          </span>
        </div>
      </motion.nav>

      <div className="flex items-center gap-3 pointer-events-auto">
        {rightActions}
        {!user ? (
          pathname !== '/' && (
            <Link
              href="/login"
              className="btn-liquid-glass px-8 py-3 rounded-2xl text-white text-[15px] font-medium"
            >
              Sign In
            </Link>
          )
        ) : (
          <>
            {pathname !== '/' && (
              <Link
                href="/"
                className="btn-liquid-glass flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-[15px] font-medium"
                title="Return Home"
              >
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
            )}
            {pathname !== '/' && (
              <motion.button
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 1] }}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={(e) => {
                   e.stopPropagation();
                   onSignOut();
                 }}
                 className="btn-liquid-glass px-8 py-3 rounded-2xl text-white text-[15px] font-medium"
              >
                Logout
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
