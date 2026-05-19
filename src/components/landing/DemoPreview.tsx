import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getInitials } from '@/lib/utils';

const desktopPersons = [
  { id: '1', name: 'Robert Johnson', gender: 'male', y: 0, x: 250, color: '#3B82F6' },
  { id: '2', name: 'Margaret Johnson', gender: 'female', y: 0, x: 500, color: '#F472B6' },
  { id: '3', name: 'James Johnson', gender: 'male', y: 160, x: 200, color: '#6366F1' },
  { id: '4', name: 'Sarah Johnson', gender: 'female', y: 160, x: 420, color: '#F59E0B' },
  { id: '5', name: 'Elizabeth Parker', gender: 'female', y: 160, x: 640, color: '#A78BFA' },
  { id: '6', name: 'Emily Johnson', gender: 'female', y: 320, x: 310, color: '#34D399' },
];

const mobilePersons = [
  { id: '1', name: 'Robert Johnson', gender: 'male', y: 0, x: 30, color: '#3B82F6' },
  { id: '2', name: 'Margaret Johnson', gender: 'female', y: 0, x: 180, color: '#F472B6' },
  { id: '3', name: 'James Johnson', gender: 'male', y: 160, x: 10, color: '#6366F1' },
  { id: '4', name: 'Sarah Johnson', gender: 'female', y: 160, x: 160, color: '#F59E0B' },
  { id: '5', name: 'Elizabeth Parker', gender: 'female', y: 160, x: 320, color: '#A78BFA' },
  { id: '6', name: 'Emily Johnson', gender: 'female', y: 320, x: 85, color: '#34D399' },
];

const mockEdges = [
  { from: '1', to: '3', type: 'child' },
  { from: '2', to: '3', type: 'child' },
  { from: '1', to: '5', type: 'child' },
  { from: '2', to: '5', type: 'child' },
  { from: '1', to: '2', type: 'spouse' },
  { from: '3', to: '4', type: 'spouse' },
  { from: '3', to: '6', type: 'child' },
  { from: '4', to: '6', type: 'child' },
];

export default function DemoPreview() {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.getBoundingClientRect().width;
      const mobileMode = window.innerWidth < 640;
      setIsMobile(mobileMode);
      
      const targetWidth = mobileMode ? 480 : 840;
      if (width < targetWidth) {
        setScale(width / targetWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const persons = isMobile ? mobilePersons : desktopPersons;
  const cardWidth = isMobile ? 130 : 170;
  const halfCardWidth = cardWidth / 2;

  return (
    <section className="pt-32 sm:pt-48 pb-24 sm:pb-32 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <div className="mb-6">
            <span className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-500">
              Preview
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.15] sm:leading-[1.1]">
            See it in action
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto">
            A preview of what your family tree could look like
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative bg-black rounded-3xl border border-white/[0.2] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Toolbar mock */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-black border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="ml-4 text-xs text-neutral-500 font-medium tracking-wide">The Johnson Family — Family Tree Editor</span>
          </div>

          {/* Canvas mock parent */}
          <div 
            ref={containerRef}
            className="relative bg-black overflow-hidden w-full transition-all duration-300 animate-fade-in"
            style={{ height: `${(isMobile ? 420 : 440) * scale}px` }}
          >
            {/* Scaled wrapper container */}
            <div 
              className="absolute left-1/2 origin-top"
              style={{
                transform: `translateX(-50%) scale(${scale})`,
                width: isMobile ? '480px' : '840px',
                height: isMobile ? '420px' : '440px',
                top: 0
              }}
            >
              {/* SVG edges */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {mockEdges.map((edge, i) => {
                  const from = persons.find((p) => p.id === edge.from)!;
                  const to = persons.find((p) => p.id === edge.to)!;
                  const fromX = from.x + halfCardWidth;
                  const fromY = from.y + (isMobile ? 60 : 70);
                  const toX = to.x + halfCardWidth;
                  const toY = to.y + 10;
                  return (
                    <motion.path
                      key={i}
                      d={`M ${fromX} ${fromY} C ${fromX} ${(fromY + toY) / 2}, ${toX} ${(fromY + toY) / 2}, ${toX} ${toY}`}
                      fill="none"
                      stroke={edge.type === 'spouse' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={1.5}
                      strokeDasharray={edge.type === 'spouse' ? '6 3' : '0'}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  );
                })}
              </svg>

              {/* Person nodes */}
              {persons.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute"
                  style={{ left: person.x, top: person.y + 10, zIndex: 2 }}
                >
                  <div className="w-[130px] sm:w-[170px] bg-neutral-900 rounded-xl border border-white/[0.08] shadow-lg p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-white/[0.2] transition-all duration-300 cursor-pointer">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shrink-0"
                      style={{ backgroundColor: person.color }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-white truncate">
                        {person.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] sm:text-xs text-neutral-500 truncate">
                        {person.name.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
