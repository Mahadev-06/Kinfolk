'use client';

import { motion } from 'framer-motion';

export default function BackgroundWaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.svg
        className="absolute w-full h-[300vh] top-0 left-0"
        viewBox="0 0 1440 3000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
        style={{ filter: "drop-shadow(0 0 15px rgba(56, 189, 248, 0.25)) drop-shadow(0 0 45px rgba(99, 102, 241, 0.15))" }}
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Wave 1 — Primary flowing curve */}
        <motion.path
          d="M-100 200 C 200 100, 500 350, 750 180 S 1100 50, 1550 200 C 1800 300, 1600 500, 1300 550 S 800 600, 500 700 C 200 780, 100 900, 300 1000 S 700 1100, 1000 1050 C 1300 1000, 1500 1150, 1550 1300 C 1600 1500, 1200 1600, 900 1550 S 400 1500, 200 1650 C 50 1800, 300 1900, 600 1850 S 1100 1800, 1400 1950 C 1600 2050, 1500 2200, 1200 2250 S 700 2300, 400 2400 C 150 2500, 300 2650, 600 2600 S 1100 2550, 1550 2700"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />

        {/* Wave 2 — Secondary parallel curve */}
        <motion.path
          d="M-50 250 C 250 150, 550 400, 800 230 S 1150 100, 1600 250 C 1850 350, 1650 550, 1350 600 S 850 650, 550 750 C 250 830, 150 950, 350 1050 S 750 1150, 1050 1100 C 1350 1050, 1550 1200, 1600 1350 C 1650 1550, 1250 1650, 950 1600 S 450 1550, 250 1700 C 100 1850, 350 1950, 650 1900 S 1150 1850, 1450 2000 C 1650 2100, 1550 2250, 1250 2300 S 750 2350, 450 2450 C 200 2550, 350 2700, 650 2650 S 1150 2600, 1600 2750"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, delay: 0.5, ease: "easeInOut" }}
        />

        {/* Wave 3 — Subtle third curve */}
        <motion.path
          d="M-200 150 C 100 50, 400 300, 650 130 S 1000 0, 1450 150 C 1700 250, 1500 450, 1200 500 S 700 550, 400 650 C 100 730, 0 850, 200 950 S 600 1050, 900 1000 C 1200 950, 1400 1100, 1450 1250 C 1500 1450, 1100 1550, 800 1500 S 300 1450, 100 1600 C -50 1750, 200 1850, 500 1800 S 1000 1750, 1300 1900 C 1500 2000, 1400 2150, 1100 2200 S 600 2250, 300 2350 C 50 2450, 200 2600, 500 2550 S 1000 2500, 1450 2650"
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, delay: 1, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
