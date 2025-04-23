'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import GradientText from '../ui/GradientText';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Smooth fade effect on scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Simple transform values without custom easing
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic taglines that change every few seconds
  const taglines = [
    "Where imagination transcends reality",
    "Discover worlds beyond imagination",
    "Every frame tells a story",
    "Feel the emotion in every scene",
    "Where art meets storytelling"
  ];

  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div ref={heroRef} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden">
      {/* Background with fade effect on scroll */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ opacity }}
      >
        {/* Main background image */}
        <div className="absolute inset-0 brightness-[0.92]">
          <Image
            src="/images/yourname.jpg"
            alt="Anime cityscape"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>
        
        {/* Light overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/30 mix-blend-overlay"></div>
        
        {/* Reduced light rays */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute h-full w-[150px] bg-gradient-to-b from-pink-200/10 via-purple-200/10 to-transparent"
              style={{
                left: `${10 + i * 20}%`,
                transform: 'rotate(15deg) translateY(-10%)',
                filter: 'blur(15px)',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Optimized particle system - fewer particles, simpler animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Reduced sparkles */}
          {Array.from({ length: 25 }).map((_, i) => {
            const size = 1 + Math.random() * 2;
            const duration = 20 + Math.random() * 20;
            return (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: `0 0 ${5 + Math.random() * 8}px ${3 + Math.random() * 4}px rgba(255, 255, 255, 0.4)`,
                  filter: 'blur(0.5px)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}
          
          {/* Fewer petals with simpler animation */}
          {Array.from({ length: 12 }).map((_, i) => {
            const size = 8 + Math.random() * 15;
            const rotateStart = Math.random() * 360;
            const colors = [
              'rgba(255, 183, 197, 0.5)', 
              'rgba(255, 218, 224, 0.5)', 
              'rgba(255, 200, 221, 0.5)', 
              'rgba(230, 230, 250, 0.5)', 
            ];
            return (
              <motion.div
                key={`petal-${i}`}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size / 2,
                  borderRadius: '50% 50% 50% 50% / 80% 80% 20% 20%',
                  backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  filter: 'blur(1px)',
                  rotate: `${rotateStart}deg`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 100],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.8, 1],
                }}
              />
            );
          })}
          
          {/* Reduced orbs with simpler animation */}
          {Array.from({ length: 6 }).map((_, i) => {
            const size = 40 + Math.random() * 80;
            const colors = [
              'rgba(255, 105, 180, 0.08)', 
              'rgba(147, 112, 219, 0.08)', 
              'rgba(64, 224, 208, 0.08)',  
              'rgba(135, 206, 250, 0.08)',  
            ];
            return (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: colors[Math.floor(Math.random() * colors.length)],
                  boxShadow: `0 0 30px ${colors[Math.floor(Math.random() * colors.length)].replace('0.08', '0.15')}`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  filter: 'blur(10px)',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          
          {/* One simpler magic circle */}
          <motion.div
            className="absolute w-40 h-40 md:w-64 md:h-64"
            style={{
              bottom: '20%',
              right: '12%',
              opacity: 0.4,
              border: '1px solid rgba(135, 206, 250, 0.3)',
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(135, 206, 250, 0.15)',
              background: 'radial-gradient(circle, rgba(135,206,250,0.03) 0%, rgba(135,206,250,0) 70%)',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-4 rounded-full border border-blue-200/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-radial-vignette opacity-20"></div>

      {/* Main content with smoother entrance animations */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            className="container mx-auto px-4 z-10 relative text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2,
              }}
              className="max-w-4xl mx-auto relative"
            >
              {/* Title badge */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="inline-block px-6 py-2.5 mb-8 text-sm rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-md border border-white/20 shadow-md"
              >
                <span className="mr-1.5">✨</span> 
                <span className="tracking-wider font-medium text-white">JOURNEY INTO ANIME</span> 
                <span className="ml-1.5">✨</span>
              </motion.div>
              
              {/* Title with subtle glow */}
              <motion.div 
                className="mb-8 relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.8,
                  duration: 0.8,
                }}
              >
                {/* Subtle text glow */}
                <div className="absolute -inset-10 blur-xl opacity-20 bg-black/40 z-0 rounded-full"></div>
                
                {/* Main title */}
                <GradientText
                  as="h1"
                  className="text-5xl md:text-8xl font-bold tracking-wider relative z-10"
                  from="pink-300"
                  to="indigo-300"
                  style={{ 
                    letterSpacing: '0.1em', 
                    textShadow: '0 0 20px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.7)'
                  }}
                >
                  AnimeVerse
                </GradientText>
                
                {/* Underline animation */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-4 mx-auto"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.2,
                  }}
                />
              </motion.div>
              
              {/* Tagline with smooth text transition */}
              <motion.div className="h-[3.5rem] relative mb-8">
                {taglines.map((tagline, index) => (
                  <motion.p
                    key={index}
                    className="text-white text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: currentTaglineIndex === index ? 1 : 0,
                      y: currentTaglineIndex === index ? 0 : 10
                    }}
                    transition={{ duration: 1.2 }}
                    style={{ 
                      fontStyle: "italic", 
                      textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4)'
                    }}
                  >
                    "{tagline}"
                  </motion.p>
                ))}
              </motion.div>
              
              {/* Description */}
              <motion.p 
                className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 3px 8px rgba(0,0,0,0.4)' }}
              >
                Step into a vibrant universe where imagination knows no bounds.
                Discover intricately crafted worlds, compelling characters, and
                emotional journeys that will leave you spellbound.
              </motion.p>
              
              {/* Buttons with subtle hover */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-5 justify-center mb-12"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.7 }}
              >
                <Link href="/blog" passHref>
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none px-8 py-3.5 rounded-full text-lg font-medium shadow-md shadow-pink-500/20 transition-all duration-300 hover:scale-[1.03]"
                  >
                  <motion.span 
                    whileHover={{ 
                      x: 3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 flex items-center"
                  >
                    <span>Explore Blog</span>
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  href="/anime/trending"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-lg font-medium transition-all duration-300 hover:scale-[1.03]"
                >
                  <motion.span 
                    whileHover={{ 
                      x: 3,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center"
                  >
                    <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Trending Anime</span>
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Feature stats with simpler animations */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto mb-20"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              {[
                { 
                  icon: "📺",
                  number: "1,500+", 
                  label: "Anime Series",
                  color: "from-pink-400 via-pink-500 to-pink-600",
                  bgColor: "from-pink-500/5 to-pink-500/2"
                },
                { 
                  icon: "✍️",
                  number: "350+", 
                  label: "Blog Articles",
                  color: "from-purple-400 via-purple-500 to-purple-600",
                  bgColor: "from-purple-500/5 to-purple-500/2"
                },
                { 
                  icon: "👥",
                  number: "25K+", 
                  label: "Community Members",
                  color: "from-blue-400 via-blue-500 to-blue-600",
                  bgColor: "from-blue-500/5 to-blue-500/2"
                },
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className={`text-center px-6 py-5 rounded-xl backdrop-blur-sm bg-gradient-to-br ${item.bgColor} border border-white/10 shadow-md overflow-hidden relative group`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.15 }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -3, 
                    transition: { duration: 0.3 } 
                  }}
                >
                  {/* Background glow on hover */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} 
                  />
                  
                  {/* Icon */}
                  <div className="text-3xl mb-3">
                    {item.icon}
                  </div>
                  
                  {/* Counter text */}
                  <div className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                    {item.number}
                  </div>
                  <div className="text-white text-sm mt-2 font-medium tracking-wide uppercase">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Featured content */}
            <motion.div
              className="mt-16 mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-8 text-white"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}
              >
                Featured Content
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    title: "Latest Reviews",
                    desc: "Explore our in-depth analysis of new releases",
                    icon: "🎬",
                    color: "from-rose-400 to-rose-600"
                  },
                  {
                    title: "Character Spotlights",
                    desc: "Dive deep into iconic anime characters",
                    icon: "🌟",
                    color: "from-amber-400 to-amber-600"
                  },
                  {
                    title: "Art Galleries",
                    desc: "Stunning collections from top anime artists",
                    icon: "🎨",
                    color: "from-emerald-400 to-emerald-600"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={`feature-${index}`}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-left relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 + index * 0.1 }}
                    whileHover={{ 
                      y: -3,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="absolute -right-4 -top-4 text-4xl">
                      {item.icon}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{item.title}</h3>
                    <p className="text-white/90 mb-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{item.desc}</p>
                    
                    <motion.button
                      className={`text-sm px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-medium flex items-center`}
                      whileHover={{ 
                        scale: 1.03,
                        x: 3,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <span>Explore</span>
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ 
            y: [0, 6, 0],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="text-white text-sm mb-3 font-medium px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 shadow-md"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: { duration: 0.3 }
            }}
          >
            <span className="mr-2">✨</span>
            <span>Scroll for Magic</span>
            <span className="ml-2">✨</span>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 3, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/60"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Simpler navigation dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <div className="flex flex-col gap-4">
          {['Home', 'Features', 'Content', 'About'].map((section, i) => (
            <motion.div
              key={section}
              className="relative group"
              initial={{ opacity: 0, x: 10 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: 2.5 + i * 0.1, duration: 0.5 } 
              }}
            >
              <div 
                className={`w-2 h-2 rounded-full bg-white/40 cursor-pointer 
                  ${i === 0 ? 'bg-white/70' : 'bg-white/40'}
                  group-hover:bg-white/70 transition-all duration-300`}
              />
              <div className="absolute top-0 right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <span className="px-2 py-1 rounded text-white text-xs bg-black/20 backdrop-blur-sm">
                  {section}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Improved vignette effect */}
      <style jsx global>{`
        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 150%);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;