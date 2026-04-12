import React from 'react';
import { motion } from 'motion/react';

interface AnimatedProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedProfileImage({ src, alt, size = 'md' }: AnimatedProfileImageProps) {
  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-48 w-48 sm:h-56 sm:w-56'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute -z-10 rounded-full bg-orange-500/20 blur-3xl ${sizeClasses[size]}`}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute -z-10 rounded-full bg-orange-300/10 blur-2xl ${sizeClasses[size]}`}
      />

      {/* Main Image Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          y: [0, -10, 0] 
        }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ 
          scale: 1.05,
          rotateY: 10,
          rotateX: -5,
          perspective: 1000
        }}
        className={`relative group cursor-pointer ${sizeClasses[size]}`}
      >
        {/* Animated Gradient Border */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-orange-600 via-orange-400 to-orange-300 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        
        {/* Glassmorphism Ring */}
        <div className="absolute -inset-[2px] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-0" />

        {/* Image Container */}
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/10 z-10 shadow-2xl">
          <motion.img
            src={src}
            alt={alt}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Glow Effect */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-orange-500/10 blur-md -z-10 group-hover:bg-orange-500/20 transition-colors"
        />
      </motion.div>
    </div>
  );
}
