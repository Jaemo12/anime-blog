'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

export default function CinematicAnimeLanding() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [introStage, setIntroStage] = useState(1);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const containerRef = useRef(null);
  
  // This is the simplest version using your original images
  const sections = [
    {
      id: 'hero',
      title: 'ANIMEVERSE',
      background: '/images/akira.jpg',
      subtitle: 'Your Gateway to Animation Excellence',
      description: 'A place to know all about the current animes'
    },
    {
      id: 'discover',
      title: 'DISCOVER',
      background: '/images/gojo.jpg',
      subtitle: 'Personalized Recommendations',
      description: 'Find your next favorite series with our AI-powered suggestions'
    },
    {
      id: 'experience',
      title: 'EXPERIENCE',
      background: '/images/bgmountain.jpg',
      subtitle: 'Immersive Viewing',
      description: 'Theater-quality streaming for the ultimate anime experience'
    },
    {
      id: 'connect',
      title: 'CONNECT',
      background: '/images/yourname.jpg',
      subtitle: 'Join The Community',
      description: 'Share your passion with fellow enthusiasts around the world'
    }
  ];

  // Handle intro animation timing
  useEffect(() => {
    // Skip the loading check - go straight to animation
    const introStage1Timer = setTimeout(() => {
      setIntroStage(2);
    }, 1500);
    
    const introStage2Timer = setTimeout(() => {
      setIntroStage(3);
    }, 3000);
    
    const introCompletionTimer = setTimeout(() => {
      setShowIntroAnimation(false);
    }, 4500);
    
    return () => {
      clearTimeout(introStage1Timer);
      clearTimeout(introStage2Timer);
      clearTimeout(introCompletionTimer);
    };
  }, []);

  // Navigate to main content
  const navigateToMain = () => {
    router.push('/main');
  };
  
  // Smooth scroll to section
  const scrollToSection = (index: number): void => {
    const sectionElement = document.getElementById(`section-${index}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Section component
  interface Section {
    id: string;
    title: string;
    background: string;
    subtitle: string;
    description: string;
  }

  const SectionComponent = ({ section, index }: { section: Section; index: number }) => {
    const [titleRef, titleInView] = useInView({ 
      threshold: 0.5,
      triggerOnce: true // Ensures the animation happens once
    });
    
    const [imageRef, imageInView] = useInView({ 
      threshold: 0.2,
      triggerOnce: true // This ensures the animation happens once and images stay visible
    });
    
    const [textRef, textInView] = useInView({ 
      threshold: 0.5,
      triggerOnce: true // Ensures the animation happens once
    });
    
    useEffect(() => {
      if (titleInView) {
        setCurrentSection(index);
      }
    }, [titleInView, index]);
    
    return (
      <section 
        id={`section-${index}`}
        className="min-h-screen w-full snap-start flex flex-col items-center relative"
        style={{ paddingTop: '2rem', paddingBottom: '4rem' }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        
        {/* Title animation */}
        <motion.div 
          ref={titleRef}
          className="w-full flex flex-col items-center justify-center pt-32 md:pt-40 pb-16 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: titleInView ? 1 : 0 }}
          transition={{ duration: 1.2 }} // Slowed down a bit
        >
          {index === 0 ? (
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight inline-block mb-4">
              <span style={{ color: '#ff0000' }}>ANIME</span>
              <span className="text-white">VERSE</span>
            </h1>
          ) : (
            <h2 className="text-6xl md:text-7xl font-bold tracking-tight inline-block mb-4">
              <span style={{ color: '#ff0000' }}>{section.title}</span>
            </h2>
          )}
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: titleInView ? 1 : 0, 
              y: titleInView ? 0 : 10
            }}
            transition={{ duration: 1.2, delay: 0.3 }} // Slowed down
            className="text-white/90 text-xl mt-8 max-w-2xl text-center px-6"
          >
            {section.description}
          </motion.p>
        </motion.div>
        
        {/* FIXED IMAGE ANIMATION - Ensures images are always visible */}
        <motion.div 
          ref={imageRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="w-full relative z-10 bg-black my-12"
        >
          <div className="cinema-container">
            {/* Div with background image and enhanced shadow */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${section.background})`,
                backgroundColor: '#111', // Fallback color if image doesn't load
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)' // Enhanced shadow
              }}
            ></div>
          </div>
        </motion.div>
        
        {/* Subtitle animation */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: textInView ? 1 : 0, 
            y: textInView ? 0 : 20 
          }}
          transition={{ duration: 1.2, delay: 0.8 }} // Slowed down and delayed more
          className="w-full flex flex-col items-center justify-center py-16 z-20 px-6"
        >
          <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white/90 text-center mb-8">
            {section.subtitle}
          </h3>
          
          {/* Call to action - Only on the last section */}
          {index === sections.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: textInView ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 1.2 }} // Slowed down
              className="mt-16"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: '#ff0000',
                  boxShadow: '0 0 30px rgba(255,0,0,0.5)' // Enhanced glow effect
                }}
                whileTap={{ scale: 0.97 }}
                onClick={navigateToMain}
                className="px-12 py-4 bg-red-600 text-white rounded-md text-lg font-medium tracking-wide transition-all duration-500"
                style={{ backgroundColor: '#ff0000' }}
              >
                Enter AnimeVerse
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </section>
    );
  };

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      {/* Studio intro animation */}
      <AnimatePresence>
        {showIntroAnimation && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            {/* Logo animation - First stage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: introStage >= 1 ? 1 : 0,
              }}
              exit={{ opacity: 0 }}
              className="text-center absolute"
            >
              <svg width="180" height="180" viewBox="0 0 150 150" className="mx-auto">
                <motion.circle 
                  cx="75" 
                  cy="75" 
                  r="60" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: introStage >= 1 ? 1 : 0 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
                <motion.path 
                  d="M50,50 L100,100 M100,50 L50,100" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: introStage >= 1 ? 1 : 0 }}
                  transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
            
            {/* Brand name animation - Uniqlo style with red and white */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: introStage >= 2 ? 1 : 0,
              }}
              transition={{ duration: 1 }}
              className="absolute text-center"
            >
              <motion.div className="text-8xl font-bold tracking-tight mt-10">
                {introStage >= 2 && "ANIME".split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 * i,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="inline-block mx-2"
                    style={{ color: '#ff0000' }}
                  >
                    {letter}
                  </motion.span>
                ))}
                {introStage >= 2 && "VERSE".split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 * (i + 5), // Start after "ANIME"
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="inline-block mx-2 text-white"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: introStage >= 3 ? 1 : 0,
                  y: introStage >= 3 ? 0 : 10
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base tracking-widest font-light mt-8 text-white/80"
              >
                STUDIOS
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content with cinematic scrolling */}
      <div className="h-screen overflow-y-auto overflow-x-hidden hide-scrollbar snap-y snap-mandatory scroll-smooth">
        {sections.map((section, index) => (
          <SectionComponent 
            key={`section-${index}`} 
            section={section} 
            index={index} 
          />
        ))}
      </div>
      
      {/* Side navigation dots - Increased size and spacing */}
      <motion.div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6"
        initial={{ opacity: 0, x: 10 }}
        animate={{ 
          opacity: !showIntroAnimation ? 1 : 0,
          x: !showIntroAnimation ? 0 : 10 
        }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {sections.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => scrollToSection(index)}
            initial={false}
            animate={{ 
              scale: currentSection === index ? 1.5 : 1,
              backgroundColor: currentSection === index ? '#ff0000' : 'rgba(255,255,255,0.3)'
            }}
            whileHover={{ scale: 1.8, backgroundColor: currentSection === index ? '#ff0000' : 'rgba(255,255,255,0.7)' }}
            className="w-3 h-3 rounded-full transition-all duration-300 relative group"
            style={{
              boxShadow: currentSection === index ? '0 0 12px rgba(255,0,0,0.7)' : 'none' // Enhanced glow
            }}
          >
            <span className="absolute right-full mr-6 py-2 px-3 bg-black/90 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {sections[index].title}
            </span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Skip intro button - Only visible during intro */}
      <AnimatePresence>
        {showIntroAnimation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            onClick={() => setShowIntroAnimation(false)}
            className="fixed bottom-10 right-10 text-white/70 hover:text-white text-sm z-50 uppercase tracking-widest px-4 py-2 border border-white/20 rounded-md hover:border-white/50 transition-all"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: black;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Hide scrollbar but allow scrolling */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Cinema container - full width image - Increased height */
        .cinema-container {
          width: 100%;
          height: 65vh; /* Increased height for more dramatic effect */
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Smooth transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Add subtle grain texture to the background */
        .grain::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('data:image/png;base64,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');
          pointer-events: none;
          opacity: 0.03;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}