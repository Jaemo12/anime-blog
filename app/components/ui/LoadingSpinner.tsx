'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const LoadingSpinner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const progressMotion = useMotionValue(0);
  const glowIntensity = useTransform(progressMotion, [0, 100], [0.3, 1]);
  
  useEffect(() => {
    // Smooth progress animation
    const progressAnimation = animate(progressMotion, 100, {
      duration: 4,
      ease: "easeInOut",
      onUpdate: (latest) => {
        setLoadingProgress(Math.min(latest, 100));
      }
    });

    // Only run in client-side environment
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    let player: HTMLElement | null = null;
    
    const loadDotLottiePlayer = async () => {
      try {
        // Dynamically import the dotlottie player
        const { DotLottiePlayer } = await import('@dotlottie/player-component');
        
        if (!customElements.get('dotlottie-player')) {
          customElements.define('dotlottie-player', DotLottiePlayer);
        }
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          
          const dotLottieElement = document.createElement('dotlottie-player');
          dotLottieElement.setAttribute('src', '/lottie/pikachu.lottie');
          dotLottieElement.setAttribute('autoplay', '');
          dotLottieElement.setAttribute('loop', '');
          dotLottieElement.setAttribute('mode', 'normal');
          dotLottieElement.style.width = '100%';
          dotLottieElement.style.height = '100%';
          
          containerRef.current.appendChild(dotLottieElement);
          player = dotLottieElement;
          
          // Speed up the animation slightly for more energy
          dotLottieElement.addEventListener('ready', () => {
            (dotLottieElement as any).setSpeed(1.2);
          });
        }
      } catch (error) {
        console.error('Error loading dotLottie player:', error);
      }
    };
    
    loadDotLottiePlayer();
    
    return () => {
      progressAnimation.stop();
      if (player && containerRef.current?.contains(player)) {
        containerRef.current.removeChild(player);
      }
    };
  }, [progressMotion]);
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle animated gradient background */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-red-100 to-blue-100"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />
        
        {/* Animated particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-400/30"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{
              y: 0,
              opacity: 0.2,
            }}
            animate={{
              y: -100,
              opacity: [0.2, 0.8, 0.2],
              x: Math.random() > 0.5 ? 
                [0, Math.random() * 20 - 10] : 
                [0, Math.random() * 20 - 10],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
      
      {/* Main content with entrance animation */}
      <motion.div 
        className="relative z-10 flex flex-col items-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        {/* Pikachu animation container */}
        <div className="relative w-72 h-72 mb-6">
          {/* Focus effect that pulses attention to the center */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 0 0 rgba(255, 242, 0, 0)',
              scale: glowIntensity
            }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255, 242, 0, 0)',
                '0 0 30px 20px rgba(255, 242, 0, 0.2)',
                '0 0 0 0 rgba(255, 242, 0, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
          
          {/* Subtle radial gradient to draw focus */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
          
          {/* Lottie player container */}
          <div 
            ref={containerRef} 
            className="w-full h-full"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255, 204, 0, 0.7))',
            }}
          />
        </div>
        
        {/* Loading text with attention-grabbing animation */}
        <motion.div className="text-center mb-6">
          <motion.h2 
            className="text-4xl font-bold mb-2 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Loading AnimeVerse
          </motion.h2>
          
          <motion.p 
            className="text-white/90 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Catching all the Pokémon for you!
          </motion.p>
        </motion.div>
        
        {/* Enhanced loading bar with smooth animation */}
        <div className="w-72 h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
            style={{ 
              width: `${loadingProgress}%`,
              boxShadow: '0 0 10px rgba(255, 204, 0, 0.7)',
            }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
        
        {/* Percentage counter with bounce animation */}
        <motion.p 
          className="text-white font-medium text-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.floor(loadingProgress)}%
        </motion.p>
      </motion.div>
      
      {/* Decorative elements that don't distract from Pikachu */}
      <motion.div 
        className="absolute bottom-4 left-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
      >
        <PokeballDecor />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 right-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2 }}
      >
        <PokeballDecor delay={0.3} />
      </motion.div>
    </div>
  );
};

// Extracted Pokeball decoration component
const PokeballDecor = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="w-8 h-8 rounded-full"
    style={{
      background: 'linear-gradient(135deg, #ff0000 0%, #ff0000 45%, #000000 45%, #000000 55%, #ffffff 55%, #ffffff 100%)',
    }}
    animate={{ 
      y: [0, -8, 0],
      rotate: [0, 180],
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <div 
      className="absolute w-2 h-2 rounded-full bg-white border border-black"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </motion.div>
);

export default LoadingSpinner;