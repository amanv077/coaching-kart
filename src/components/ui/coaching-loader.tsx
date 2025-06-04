"use client";

import { motion } from "framer-motion";

export interface CoachingLoaderProps {
  text?: string;
  className?: string;
}

export const CoachingLoader: React.FC<CoachingLoaderProps> = ({ 
  text,
  className
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Premium outer glow ring */}
        <motion.div
          className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Elegant outer ring */}
        <motion.div
          className="w-24 h-24 border-[3px] border-gradient-to-r from-blue-300 via-blue-500 to-blue-700 rounded-full shadow-lg"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #1d4ed8, #1e40af, #3b82f6)",
            padding: "3px",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-white rounded-full" />
        </motion.div>

        {/* Inner sophisticated ring */}
        <motion.div
          className="absolute inset-3 w-18 h-18 border-2 border-blue-500/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Premium center "C" logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-2xl border border-blue-400/20">
              <span className="text-white font-bold text-2xl tracking-tight">C</span>
            </div>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl" />
          </div>
        </motion.div>

        {/* Elegant floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.3, 1, 0.3],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            initial={{
              x: Math.cos((i * 45 * Math.PI) / 180) * 50,
              y: Math.sin((i * 45 * Math.PI) / 180) * 50,
            }}
          />
        ))}

        {/* Premium accent dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`accent-${i}`}
            className="absolute w-2 h-2 bg-blue-500/60 rounded-full blur-[0.5px]"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: [0, -360],
              x: Math.cos((i * 120 * Math.PI) / 180) * 35,
              y: Math.sin((i * 120 * Math.PI) / 180) * 35,
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Minimal loading indicator */}
      <motion.div
        className="absolute mt-28 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {text && (
        <p className="text-gray-700 font-medium mt-32">{text}</p>
      )}
    </div>
  );
};

// Full page coaching loader component
interface PageCoachingLoaderProps {
  text?: string;
}

export const PageCoachingLoader: React.FC<PageCoachingLoaderProps> = ({ 
  text = "Loading..." 
}) => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-sm z-50 flex items-center justify-center">
    <CoachingLoader text={text} />
  </div>
);

export default CoachingLoader;
