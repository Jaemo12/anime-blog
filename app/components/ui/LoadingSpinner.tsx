'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// Color palette definition for consistent use throughout the component
const colors = {
  primary: '#FFC107', // Amber - primary Pikachu yellow
  secondary: '#536DFE', // Indigo - complementary to yellow
  accent1: '#FF5722', // Deep Orange - warm accent
  accent2: '#4CAF50', // Green - nature accent
  light: '#F5F5F5', // Almost white
  dark: '#212121', // Almost black
  gradientStart: '#FFF8E1', // Soft yellow
  gradientMid: '#E8F5E9', // Soft green
  gradientEnd: '#E3F2FD', // Soft blue
};

const LoadingSpinner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);
  const progressMotion = useMotionValue(0);
  const glowIntensity = useTransform(progressMotion, [0, 100], [0.3, 1]);
  
  // For better performance, limit the number of particles based on device capability
  const [particleCount, setParticleCount] = useState(15);
  
  // Check if device is high-end enough for more particles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isHighEndDevice = window.navigator.hardwareConcurrency > 4;
      setParticleCount(isHighEndDevice ? 20 : 10);
    }
  }, []);
  
  useEffect(() => {
    // Smooth progress animation with easing curve for more natural progression
    const progressAnimation = animate(progressMotion, 100, {
      duration: 4, 
      ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      onUpdate: (latest) => {
        setLoadingProgress(Math.min(latest, 100));
      },
      onComplete: () => {
        // Add any completion logic here if needed
      }
    });

    // Only run in client-side environment
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    let player: HTMLElement | null = null;
    
    const loadDotLottiePlayer = async () => {
      try {
        // Show loading feedback while Lottie is loading
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="flex items-center justify-center w-full h-full"><div class="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>`;
        }
        
        // Dynamically import the dotlottie player with error handling
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
          
          // Speed up the animation slightly for more energy and add ready handler
          dotLottieElement.addEventListener('ready', () => {
            (dotLottieElement as any).setSpeed(1.2);
            setIsLottieLoaded(true);
          });
          
          // Add error handler
          dotLottieElement.addEventListener('error', (error) => {
            console.error('DotLottie player error:', error);
            // Fallback to static content if lottie fails
            if (containerRef.current) {
              containerRef.current.innerHTML = `<div class="flex items-center justify-center w-full h-full"><div class="w-32 h-32 bg-contain bg-center bg-no-repeat flex items-center justify-center text-5xl">⚡</div></div>`;
            }
          });
        }
      } catch (error) {
        console.error('Error loading dotLottie player:', error);
        // Fallback content if player fails to load
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="flex items-center justify-center w-full h-full text-amber-400 text-4xl font-bold">⚡</div>`;
        }
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
  
  // Create animated message variants
  const loadingMessages = [
    "Catching all the Pokémon!",
    "Charging Pikachu's powers...",
    "Preparing your anime experience...",
    "Almost ready to explore!"
  ];
  
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Cycle through messages
  useEffect(() => {
    if (!isLottieLoaded) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLottieLoaded, loadingMessages.length]);
  
  // Generate a random particle color from our palette
  const getParticleColor = (index: number) => {
    const colorOptions = [
      `rgba(255, 193, 7, 0.3)`,   // Amber (primary)
      `rgba(83, 109, 254, 0.3)`,  // Indigo (secondary)
      `rgba(255, 87, 34, 0.25)`,  // Deep Orange (accent1)
      `rgba(76, 175, 80, 0.25)`,  // Green (accent2)
    ];
    
    return colorOptions[index % colorOptions.length];
  };
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic animated gradient background with harmonious colors */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundSize: '200% 200%',
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientMid} 50%, ${colors.gradientEnd} 100%)`,
          }}
        />
        
        {/* Animated particles with harmonious colors */}
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: getParticleColor(i),
              filter: 'blur(1px)'
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
        className="relative z-10 flex flex-col items-center p-8 rounded-3xl backdrop-blur-md border"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.15) inset`
        }}
      >
        {/* Pikachu animation container with enhanced visual effects */}
        <div className="relative w-72 h-72 mb-6">
          {/* Layered glowing effects around Pikachu */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 0 0 rgba(255, 193, 7, 0)',
              scale: glowIntensity
            }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(255, 193, 7, 0)',
                `0 0 30px 20px rgba(255, 193, 7, 0.3)`,
                '0 0 0 0 rgba(255, 193, 7, 0)'
              ]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
          
          {/* Electric sparks effect (subtle, using our color palette) */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-8 rounded-full origin-bottom"
                style={{
                  left: `${45 + Math.random() * 10}%`,
                  bottom: `${45 + Math.random() * 10}%`,
                  filter: 'blur(1px)',
                  opacity: 0,
                  backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scaleY: [0, 1, 0],
                  rotate: [Math.random() * 60 - 30, Math.random() * 60 - 30]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2 + Math.random() * 5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Subtle radial gradient to draw focus */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
          
          {/* Lottie player container with enhanced shadow */}
          <div 
            ref={containerRef} 
            className="w-full h-full"
            style={{
              filter: `drop-shadow(0 0 15px rgba(255, 193, 7, 0.7))`,
            }}
          />
          
          {/* Loading rings around Pikachu (only visible when loading) */}
          {!isLottieLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full absolute rounded-full border-2 border-dashed animate-spin-slow"
                style={{ borderColor: `${colors.primary}80` }}
              ></div>
              <div className="w-3/4 h-3/4 absolute rounded-full border-2 border-dashed animate-reverse-spin-slow"
                style={{ borderColor: `${colors.secondary}80` }}
              ></div>
            </div>
          )}
        </div>
        
        {/* Loading text with attention-grabbing animation */}
        <div className="text-center mb-6">
          <motion.h2 
            className="text-4xl font-bold mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              color: colors.light,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            Loading AnimeVerse
          </motion.h2>
          
          {/* Animated cycling messages */}
          <div className="h-8 relative overflow-hidden">
            {loadingMessages.map((message, index) => (
              <motion.p 
                key={index}
                className="absolute inset-0 flex items-center justify-center text-lg"
                initial={{ y: 40, opacity: 0 }}
                animate={{ 
                  y: messageIndex === index ? 0 : 40,
                  opacity: messageIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.4 }}
                style={{ color: `${colors.light}E0` }}
              >
                {message}
              </motion.p>
            ))}
          </div>
        </div>
        
        {/* Enhanced loading bar with gradient colors from our palette */}
        <div className="w-72 h-3 rounded-full overflow-hidden mb-3 p-0.5" 
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <motion.div 
            className="h-full rounded-full"
            style={{ 
              width: `${loadingProgress}%`,
              background: `linear-gradient(to right, ${colors.primary}, ${colors.accent1}, ${colors.secondary})`,
              boxShadow: `0 0 10px ${colors.primary}B0, 0 0 5px white inset`,
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Animated percentage counter with emphasis for milestones */}
        <motion.div 
          className="font-medium text-lg relative h-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color: colors.light }}
        >
          <motion.span
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
              loadingProgress >= 25 && loadingProgress < 50 ? 'text-xl font-bold' :
              loadingProgress >= 50 && loadingProgress < 75 ? 'text-xl font-bold' :
              loadingProgress >= 75 && loadingProgress < 100 ? 'text-xl font-bold' :
              loadingProgress >= 100 ? 'text-2xl font-bold' : ''
            }`}
            style={{
              color: loadingProgress >= 25 && loadingProgress < 50 ? colors.primary :
                     loadingProgress >= 50 && loadingProgress < 75 ? colors.accent1 :
                     loadingProgress >= 75 && loadingProgress < 100 ? colors.secondary :
                     loadingProgress >= 100 ? colors.primary : colors.light
            }}
            animate={loadingProgress === 100 ? {
              scale: [1, 1.2, 1],
              transition: { duration: 0.5 }
            } : {}}
          >
            {Math.floor(loadingProgress)}%
          </motion.span>
        </motion.div>
      </motion.div>
      
      {/* Enhanced decorative elements with our color palette */}
      <motion.div 
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <PokeballDecor size={10} delay={0} color1={colors.accent1} color2={colors.light} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <PokeballDecor size={10} delay={0.3} color1={colors.primary} color2={colors.light} />
      </motion.div>
      
      {/* Multiple pokeballs floating at top with different color combinations */}
      <motion.div 
        className="absolute top-10 left-1/4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <PokeballDecor size={8} delay={0.5} color1={colors.secondary} color2={colors.light} />
      </motion.div>
      
      <motion.div 
        className="absolute top-16 right-1/4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <PokeballDecor size={6} delay={0.8} color1={colors.accent2} color2={colors.light} />
      </motion.div>
    </div>
  );
};

// Enhanced Pokeball decoration component with color customization
const PokeballDecor = ({ 
  delay = 0, 
  size = 8,
  color1 = '#FF5722',
  color2 = '#FFFFFF'
}: { 
  delay?: number; 
  size?: number;
  color1?: string;
  color2?: string;
}) => (
  <motion.div
    className="rounded-full relative"
    style={{
      width: `${size}rem`,
      height: `${size}rem`,
      background: `linear-gradient(135deg, ${color1} 0%, ${color1} 45%, #000000 45%, #000000 55%, ${color2} 55%, ${color2} 100%)`,
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }}
    animate={{ 
      y: [0, -10, 0],
      rotate: [0, 180],
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {/* Central button with 3D effect */}
    <div className="absolute w-1/5 h-1/5 rounded-full bg-white border-2 border-gray-800 flex items-center justify-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      <div className="w-2/3 h-2/3 rounded-full bg-white/80"></div>
    </div>
    
    {/* Shine effect */}
    <div 
      className="absolute w-1/4 h-1/4 rounded-full bg-white/40"
      style={{
        top: '20%',
        left: '20%',
      }}
    />
  </motion.div>
);

// Add global styles for special animations
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes reverse-spin-slow {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    
    .animate-reverse-spin-slow {
      animation: reverse-spin-slow 6s linear infinite;
    }
  `}</style>
);

const EnhancedLoadingSpinner = () => (
  <>
    <GlobalStyles />
    <LoadingSpinner />
  </>
);

export default EnhancedLoadingSpinner;