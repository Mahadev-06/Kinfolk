'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const ScrollStack = dynamic(() => import('./ScrollStack'), { ssr: false });
const ScrollStackItemComponent = dynamic(
  () => import('./ScrollStack').then(mod => {
    const Component = mod.ScrollStackItem;
    return { default: Component };
  }),
  { ssr: false }
);

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: 'Visual Tree Builder',
    description: 'Drag, drop, and connect family members on an interactive canvas. Auto-layout positions everyone perfectly with smart relationship detection.',
    accent: 'from-white/10 to-white/[0.03]',
    iconBg: 'bg-white/10',
    number: '01',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
      </svg>
    ),
    title: 'Cloud Synchronization',
    description: 'Your family data is securely synchronized to the cloud. Access your lineage from any device, anywhere in the world, with instant updates.',
    accent: 'from-white/10 to-white/[0.03]',
    iconBg: 'bg-white/10',
    number: '02',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: 'Secure Account Storage',
    description: 'Create a personal account to safeguard your family story. High-grade encryption and Supabase-backed security ensure your data is always protected.',
    accent: 'from-white/10 to-white/[0.03]',
    iconBg: 'bg-white/10',
    number: '03',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    title: 'Smart Relationships',
    description: 'Automatic bidirectional linking with cycle detection keeps your tree consistent. Define parents, children, and spouses — the system handles the rest.',
    accent: 'from-white/10 to-white/[0.03]',
    iconBg: 'bg-white/10',
    number: '04',
  },
];

export default function Features() {
  return (
    <section className="relative z-10">
      {/* Section heading */}
      <div className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-500 mb-5">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.15] sm:leading-[1.1]">
            Everything you need to<br />map your lineage
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
            Powerful, intuitive tools designed to make building family trees effortless and beautiful.
          </p>
        </motion.div>
      </div>

      {/* ScrollStack feature cards */}
      <ScrollStack
        className="use-window"
        useWindowScroll={true}
        itemDistance={60}
        itemScale={0.02}
        itemStackDistance={80}
        stackPosition="18%"
        scaleEndPosition="8%"
        baseScale={0.85}
        blurAmount={2}
      >
        {features.map((feature, i) => (
          <ScrollStackItemComponent key={i}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`relative bg-gradient-to-br ${feature.accent} backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 transition-all duration-500 hover:scale-[1.02] hover:border-white/[0.2] hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.05)] card-glow`}>
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                <div className="p-6 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                  {/* Left: number + icon */}
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-neutral-600 tracking-widest">
                      {feature.number}
                    </span>
                    <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center text-white border border-white/[0.06]`}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1 min-w-0 text-left sm:mt-2">
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItemComponent>
        ))}
      </ScrollStack>
    </section>
  );
}
