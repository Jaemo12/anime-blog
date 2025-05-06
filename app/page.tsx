'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AnimeLanding() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [introStage, setIntroStage] = useState(1);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const mainRef = useRef(null);
  
  // Handle client-side initialization
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Enhanced sections with more sophisticated content
  const sections = [
    {
      id: 'hero',
      title: 'ANIMEVERSE',
      background: '/images/akira.jpg',
      subtitle: 'Your Gateway to Animation Excellence',
      description: 'Dive into a world where imagination knows no bounds. Create, share, and explore anime stories that resonate with fans worldwide.',
      featuredText: 'DISCOVER · WRITE · CONNECT',
      stats: [
        { value: '10K+', label: 'Stories', icon: '📚' },
        { value: '50K+', label: 'Writers', icon: '✍️' },
        { value: '2M+', label: 'Readers', icon: '👥' }
      ]
    },
    {
      id: 'discover',
      title: 'DISCOVER',
      background: '/images/gojo.jpg',
      subtitle: 'Personalized Recommendations',
      description: 'Our AI-powered system learns your preferences to suggest stories you will love, from classic shōnen to cutting-edge isekai.',
      features: [
        { icon: '✨', text: 'Curated collections by genre' },
        { icon: '📈', text: 'Weekly trending stories' },
        { icon: '📚', text: 'Personalized reading lists' }
      ]
    },
    {
      id: 'create',
      title: 'CREATE',
      background: '/images/bgmountain.jpg',
      subtitle: 'Premium Writing Experience',
      description: 'Craft your narratives with our state-of-the-art editor, featuring real-time collaboration, AI assistance, and rich media support.',
      tools: [
        { name: 'Character Builder', description: 'Create complex characters with detailed profiles' },
        { name: 'Plot Navigator', description: 'Structure your story with our intuitive outlining tool' },
        { name: 'Style Enhancer', description: 'Refine your writing with AI-powered suggestions' }
      ]
    },
    {
      id: 'connect',
      title: 'CONNECT',
      background: '/images/yourname.jpg',
      subtitle: 'Join The Community',
      description: 'Share your passion with fellow enthusiasts in a vibrant ecosystem of creators and fans from across the globe.',
      testimonials: [
        { quote: "AnimeVerse completely transformed how I share my stories with other fans.", author: "Sakura, Fantasy Writer" },
        { quote: "The community feedback helped me grow from amateur to published author.", author: "Takeshi, Sci-Fi Creator" }
      ]
    }
  ];

  // Handle intro animation with more sophisticated timing
  useEffect(() => {
    if (!isMounted || !showIntroAnimation) return;
    
    const introSequence = [
      { stage: 2, delay: 1200 },
      { stage: 3, delay: 2400 },
      { stage: 0, delay: 4000 } // 0 represents completion
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    introSequence.forEach(step => {
      const timer = setTimeout(() => {
        if (step.stage === 0) {
          setShowIntroAnimation(false);
        } else {
          setIntroStage(step.stage);
        }
      }, step.delay);
      
      timers.push(timer);
    });
    
    // Skip button handler
    const handleKeyPress = (e: { key: string; }) => {
      if (e.key === 'Escape') {
        setShowIntroAnimation(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMounted, showIntroAnimation]);

  // Navigate to main content with smooth transition
  const navigateToMain = () => {
    // Create a page transition effect
    if (typeof document !== 'undefined') {
      document.body.classList.add('page-transition');
    }
    
    setTimeout(() => {
      router.push('/main');
    }, 800);
  };
  
  // Enhanced smooth scroll to section with improved animation - SSR compatible
  const scrollToSection = (index: React.SetStateAction<number>) => {
    if (!mainRef.current) return;
    
    // Set current section immediately for UI response
    setCurrentSection(index);
    
    // Get the section element
    const sectionElement = document.getElementById(`section-${index}`);
    
    if (sectionElement) {
      // Use the element's position for scrolling
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  // Handle scroll to update active section with SSR compatibility
  useEffect(() => {
    if (!isMounted || !mainRef.current || showIntroAnimation) return;
    
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const scrollPosition = mainRef.current.scrollTop;
      const viewportHeight = mainRef.current.clientHeight || 800;
      
      let newSection = 0;
      sections.forEach((_, index) => {
        const sectionElement = document.getElementById(`section-${index}`);
        if (!sectionElement) return;
        
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;
        
        // Section is in view if its position is within the viewport
        if (
          scrollPosition >= sectionTop - viewportHeight * 0.5 &&
          scrollPosition < sectionTop + sectionHeight - viewportHeight * 0.5
        ) {
          newSection = index;
        }
      });
      
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };
    
    // Add scroll event listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    mainRef.current.addEventListener('scroll', scrollListener);
    
    // Initial check
    handleScroll();
    
    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', scrollListener);
      }
    };
  }, [isMounted, currentSection, sections.length, showIntroAnimation]);
  
  // Enhanced Section component with simplified animations
  const SectionComponent = ({ section, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    
    useEffect(() => {
      if (!sectionRef.current || !isMounted) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        {
          threshold: 0.2,
        }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, [isMounted]);
    
    return (
      <section 
        ref={sectionRef}
        id={`section-${index}`}
        className="min-h-screen w-full flex flex-col items-center justify-center relative snap-center"
      >
        {/* Static background with overlay */}
        <div 
          className="absolute inset-0 w-full h-full z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${section.background})`
          }}
        >
          <div 
            className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/80"
          />
        </div>
        
        {/* Background particles for the hero section */}
        {index === 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white/20 animate-float"
                style={{
                  width: `${Math.floor(Math.random() * 5) + 2}px`,
                  height: `${Math.floor(Math.random() * 5) + 2}px`,
                  left: `${Math.floor(Math.random() * 100)}%`,
                  top: `${Math.floor(Math.random() * 100)}%`,
                  animationDuration: `${Math.floor(Math.random() * 20) + 10}s`,
                  animationDelay: `${Math.floor(Math.random() * 5)}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Floating icons for discover section */}
        {index === 1 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {['📜', '📖', '✍️', '🔍'].map((icon, i) => (
              <div 
                key={i}
                className="absolute text-2xl md:text-4xl animate-float-icons"
                style={{
                  left: `${10 + (i * 20) % 80}%`,
                  top: `${10 + (i * 23) % 80}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        )}
        
        {/* Connection bubbles for the connect section */}
        {index === 3 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full border border-white/30 animate-pulse-slow"
                style={{
                  width: `${Math.floor(Math.random() * 60) + 40}px`,
                  height: `${Math.floor(Math.random() * 60) + 40}px`,
                  left: `${Math.floor(Math.random() * 100)}%`,
                  top: `${Math.floor(Math.random() * 100)}%`,
                  opacity: Math.random() * 0.2 + 0.1,
                  animationDuration: `${Math.floor(Math.random() * 10) + 10}s`,
                  animationDelay: `${Math.floor(Math.random() * 5)}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Main content with animation */}
        <motion.div 
          className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 50
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Title with animation */}
          <div className="mb-16 relative text-center">
            {/* Accent line */}
            <motion.div 
              className="h-0.5 w-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isVisible ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
            
            {index === 0 ? (
              <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-none mb-6">
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 30
                  }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  ANIME
                </motion.span>
                <motion.span 
                  className="block text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 30
                  }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  VERSE
                </motion.span>
              </h1>
            ) : (
              <motion.h2 
                className="text-6xl md:text-8xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-red-600 to-red-500"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 30
                }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {section.title}
              </motion.h2>
            )}
            
            {/* Description */}
            <motion.p
              className="text-white/90 text-xl md:text-2xl max-w-2xl mx-auto mt-8 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20
              }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              {section.description}
            </motion.p>
            
            {/* Featured text for hero section */}
            {index === 0 && section.featuredText && (
              <motion.div
                className="mt-12 md:mt-16 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <p className="tracking-widest text-white/60 text-sm font-light">
                  {section.featuredText}
                </p>
              </motion.div>
            )}
          </div>
          
          {/* Section-specific content */}
          <div className="w-full mt-8 md:mt-12">
            {/* Stats for hero section */}
            {index === 0 && section.stats && (
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-10">
                {section.stats.map((stat: { icon: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                  <motion.div 
                    key={i} 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 30
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.3 + i * 0.1
                    }}
                  >
                    <div className="relative mb-2 flex justify-center">
                      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                      <div className="relative flex flex-col items-center">
                        <span className="text-4xl mb-2">{stat.icon}</span>
                        <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Features for discover section */}
            {index === 1 && section.features && (
              <div className="mt-16 grid gap-6 max-w-3xl mx-auto">
                {section.features.map((feature: { icon: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                  <motion.div
                    key={i}
                    className="flex items-center backdrop-blur-sm bg-black/20 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-all duration-500"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0,
                      x: isVisible ? 0 : -50
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.1 + i * 0.15
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mr-5 text-2xl">
                      {feature.icon}
                    </div>
                    <p className="text-white font-medium text-lg">{feature.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Tools for create section */}
            {index === 2 && section.tools && (
              <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {section.tools.map((tool: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                  <motion.div
                    key={i}
                    className="backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-white/10 hover:border-red-500/30 transition-all duration-500 flex flex-col relative overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0,
                      y: isVisible ? 0 : 30
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.2 + i * 0.1
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h3 className="text-xl font-medium text-white mb-3 relative">{tool.name}</h3>
                    <p className="text-white/70 flex-1 relative">{tool.description}</p>
                    <div className="mt-4 w-8 h-0.5 bg-red-500 group-hover:w-full transition-all duration-500"></div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Testimonials for connect section */}
            {index === 3 && section.testimonials && (
              <div className="mt-16 grid gap-8 max-w-3xl mx-auto">
                {section.testimonials.map((testimonial: { quote: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; author: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                  <motion.div
                    key={i}
                    className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0,
                      scale: isVisible ? 1 : 0.9
                    }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.3 + i * 0.2
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -top-5 -left-3 text-6xl text-red-500/60">"</div>
                    <p className="text-white/90 text-lg font-light italic mb-4 relative">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 mr-3"></div>
                      <p className="text-white/70 text-sm">{testimonial.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Call to action */}
            <div className="mt-20 md:mt-28 text-center">
              {index === sections.length - 1 ? (
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 30
                  }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button
                    onClick={navigateToMain}
                    className="px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-lg font-medium tracking-wide transition-all duration-500 relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 40px rgba(239,68,68,0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-700"></span>
                    <span className="relative z-10">Enter AnimeVerse</span>
                  </motion.button>
                  
                  <p className="text-white/50 text-sm mt-6">Join 2M+ writers and readers today</p>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => scrollToSection(index + 1)}
                  className="group flex items-center space-x-2 mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 30
                  }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white group-hover:text-red-400 transition-colors text-lg mr-2">
                    Explore {sections[index + 1].title.toLowerCase()}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-full border border-white/30 group-hover:border-red-400 flex items-center justify-center transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white group-hover:text-red-400 transition-colors animate-bounce-gentle"
                    >
                      <path d="M12 5v14"></path>
                      <path d="M19 12l-7 7-7-7"></path>
                    </svg>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    );
  };

  // Don't render anything until client-side hydration completes
  if (!isMounted) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading experience...</div>
      </div>
    );
  }

  return (
    <div className="relative bg-black text-white">
      {/* Studio intro animation with advanced effects */}
      <AnimatePresence>
        {showIntroAnimation && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Dynamic background grid */}
            <div className="absolute inset-0 grid-bg"></div>
            
            {/* Logo animation - First stage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: introStage >= 1 ? 1 : 0 }}
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
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path 
                  d="M50,50 L100,100 M100,50 L50,100" 
                  stroke="white" 
                  strokeWidth="2" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: introStage >= 1 ? 1 : 0 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
            
            {/* Premium brand name animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: introStage >= 2 ? 1 : 0 }}
              className="absolute text-center"
            >
              <div className="text-8xl font-extrabold tracking-tighter">
                {introStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="block mb-2 text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-600"
                  >
                    ANIME
                  </motion.div>
                )}
                {introStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="block text-white"
                  >
                    VERSE
                  </motion.div>
                )}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: introStage >= 2 ? 1 : 0,
                  y: introStage >= 2 ? 0 : 10
                }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-base tracking-widest font-light mt-8 text-white/80"
              >
                IMMERSIVE STORYTELLING
              </motion.div>
            </motion.div>
            
            {/* Skip intro button with premium styling */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: introStage >= 2 ? 1 : 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={() => setShowIntroAnimation(false)}
              className="fixed bottom-10 right-10 text-white/70 hover:text-white text-sm z-50 uppercase tracking-widest px-6 py-3 border border-white/20 rounded-lg hover:border-red-500/50 transition-all backdrop-blur-sm overflow-hidden group"
            >
              <span className="relative z-10">Skip Intro</span>
              <div 
                className="absolute inset-0 bg-red-500/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-400"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content container with snap scrolling for premium feel */}
      <div 
        ref={mainRef}
        className="h-screen overflow-y-auto overflow-x-hidden hide-scrollbar snap-y snap-mandatory"
        style={{
          WebkitOverflowScrolling: 'touch', // Better iOS scrolling
          scrollSnapType: 'y mandatory'
        }}
      >
        {/* Generate sections */}
        {sections.map((section, index) => (
          <SectionComponent 
            key={index}
            section={section} 
            index={index}
          />
        ))}
      </div>
      
      {/* Animated side navigation dots */}
      <div 
        className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-6 transition-opacity duration-500 ${
          showIntroAnimation ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="relative group"
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-gradient-to-r from-red-500to-red-600' 
                : 'bg-white/30 group-hover:bg-white/50'
            }`}
            style={{
              boxShadow: currentSection === index ? '0 0 12px rgba(239,68,68,0.6)' : 'none'
            }}
            />
            <div className="absolute left-0 transform -translate-x-full px-4 py-1 rounded bg-black/80 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm -ml-2">
              {sections[index].title}
            </div>
          </button>
        ))}
      </div>
      
      {/* Animated progress indicator */}
      <div
        className={`fixed top-0 left-0 h-1 z-40 transition-all duration-500 ${
          showIntroAnimation ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          width: !showIntroAnimation ? `${(currentSection + 1) / sections.length * 100}%` : '0%',
          background: 'linear-gradient(90deg, #ef4444, #dc2626)'
        }}
      />
      
      {/* Header with logo and nav */}
      <header
        className={`fixed top-0 left-0 right-0 p-6 z-40 flex justify-between items-center transition-opacity duration-500 ${
          showIntroAnimation ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">ANIME</span>
            <span className="text-white ml-1">VERSE</span>
          </div>
        </div>
        
        {/* Nav links - Desktop only */}
        <div className="hidden md:flex space-x-8">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`text-sm tracking-wide uppercase relative ${
                currentSection === index ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {section.title}
              <div 
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 transform origin-left transition-transform duration-300 ${
                  currentSection === index ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>
        
        {/* Login button */}
        <button className="px-5 py-2 rounded text-white text-sm relative overflow-hidden group">
          <span className="relative z-10">Login</span>
          <div className="absolute inset-0 border border-white/20 rounded group-hover:border-red-500/50 transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </header>
      
      {/* Mobile menu */}
      <div
        className={`md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${
          showIntroAnimation ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex space-x-2 bg-black/80 backdrop-blur-md px-4 py-3 rounded-full border border-white/10">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className="w-2.5 h-2.5 rounded-full relative"
            >
              <div 
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  currentSection === index ? 'bg-red-500 scale-125' : 'bg-white/30'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        /* Base styles */
        html {
          scroll-behavior: smooth;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: black;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Hide scrollbar but allow scrolling */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Page transition effect */
        .page-transition {
          animation: fadeOut 0.8s ease forwards;
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        /* Grid background for intro */
        .grid-bg {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridMove 20s linear infinite;
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        
        /* Floating animations */
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(30px, 15px); }
          50% { transform: translate(15px, 30px); }
          75% { transform: translate(-15px, 15px); }
        }
        
        .animate-float {
          animation: float 15s infinite ease-in-out;
        }
        
        @keyframes floatIcons {
          0% { opacity: 0; transform: scale(0); }
          10% { opacity: 0.7; transform: scale(1); }
          90% { opacity: 0.7; transform: scale(1) translate(0, 0) rotate(0deg); }
          30% { transform: translate(20px, -20px) rotate(10deg); }
          60% { transform: translate(-20px, 20px) rotate(-10deg); }
          100% { opacity: 0; transform: scale(0); }
        }
        
        .animate-float-icons {
          animation: floatIcons 15s infinite ease-in-out;
        }
        
        @keyframes pulseSlow {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 5s infinite ease-in-out;
        }
        
        /* Bounce animation for scroll arrows */
        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 2s infinite ease-in-out;
        }
        
        /* Reduce motion at user request */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}