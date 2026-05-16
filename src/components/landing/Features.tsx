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
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15h2m-2 4h2m2-9.66c.33.19.64.44.9.72M12 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM12 2a10 10 0 100 20 10 10 0 000-20z" />
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
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
              <div className={`relative bg-gradient-to-br ${feature.accent} backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50`}>
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="p-8 sm:p-10 lg:p-12 flex flex-row items-start gap-8">
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
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
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
