import React from 'react';
import { motion } from 'framer-motion';

const NeonTitle = () => {
  return (
    <div className="text-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rock+3D&display=swap');

        .neon-container {
          position: relative;
          display: inline-block;
          padding: 2rem 2.5rem 1.5rem;
          background-color: rgba(0, 0, 0, 0.85);
          border-radius: 8px;
          margin: 2rem 0;
          border: 1px solid rgba(255, 45, 149, 0.2);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .neon-sign {
          font-family: 'Rock 3D', cursive;
          font-weight: 400;
          color: #fff;
          opacity: 0;
          line-height: 1.1;
          animation: turnOn 2s ease-in-out forwards,
                     signFlicker 4s ease-in-out 2s infinite;
        }

        .neon-sign.anime {
          text-shadow: 
            0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px #ff2d95,
            0 0 42px #ff2d95,
            0 0 82px #ff2d95,
            0 0 92px #ff2d95;
          animation-delay: 0s;
        }

        .neon-sign.verse {
          text-shadow: 
            0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px #ff2d95,
            0 0 42px #ff2d95,
            0 0 82px #ff2d95,
            0 0 92px #ff2d95;
          animation-delay: 0.7s;
        }
        
        @keyframes turnOn {
          0% {
            opacity: 0;
            text-shadow: none;
          }
          10% {
            opacity: 0;
            text-shadow: none;
          }
          10.1% {
            opacity: 1;
            text-shadow: 
              0 0 7px #fff,
              0 0 10px #fff;
          }
          10.2% {
            opacity: 0;
            text-shadow: none;
          }
          20% {
            opacity: 0;
            text-shadow: none;
          }
          20.1% {
            opacity: 1;
            text-shadow: 
              0 0 7px #fff,
              0 0 10px #fff,
              0 0 21px #ff2d95;
          }
          20.6% {
            opacity: 0;
            text-shadow: none;
          }
          30% {
            opacity: 0;
            text-shadow: none;
          }
          30.1% {
            opacity: 1;
            text-shadow: 
              0 0 7px #fff,
              0 0 10px #fff,
              0 0 21px #ff2d95,
              0 0 42px #ff2d95;
          }
          30.5% {
            opacity: 1;
          }
          30.6% {
            opacity: 0;
          }
          45% {
            opacity: 0;
          }
          45.1% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          55% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            text-shadow: 
              0 0 7px #fff,
              0 0 10px #fff,
              0 0 21px #ff2d95,
              0 0 42px #ff2d95,
              0 0 82px #ff2d95,
              0 0 92px #ff2d95;
          }
        }

        @keyframes signFlicker {
          0%, 100% { opacity: 1; }
          41% { opacity: 1; }
          42% { opacity: 0.8; }
          43% { opacity: 1; }
          45% { opacity: 0.3; }
          46% { opacity: 1; }
        }

        /* Corner decorations */
        .corner-decoration {
          position: absolute;
          width: 30px;
          height: 30px;
          opacity: 0.7;
        }

        .top-left {
          top: 8px;
          left: 8px;
          border-top: 2px solid rgba(255, 45, 149, 0.6);
          border-left: 2px solid rgba(255, 45, 149, 0.6);
        }

        .top-right {
          top: 8px;
          right: 8px;
          border-top: 2px solid rgba(255, 45, 149, 0.6);
          border-right: 2px solid rgba(255, 45, 149, 0.6);
        }

        .bottom-left {
          bottom: 8px;
          left: 8px;
          border-bottom: 2px solid rgba(255, 45, 149, 0.6);
          border-left: 2px solid rgba(255, 45, 149, 0.6);
        }

        .bottom-right {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid rgba(255, 45, 149, 0.6);
          border-right: 2px solid rgba(255, 45, 149, 0.6);
        }

        /* Mounting bolts */
        .bolt {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: #333;
          border-radius: 50%;
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.8);
          z-index: 2;
        }

        .bolt-1 { top: 10px; left: 10px; }
        .bolt-2 { top: 10px; right: 10px; }
        .bolt-3 { bottom: 10px; left: 10px; }
        .bolt-4 { bottom: 10px; right: 10px; }

        /* Glow behind text */
        .neon-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 45, 149, 0.15) 0%,
            rgba(255, 45, 149, 0.05) 40%,
            rgba(0, 0, 0, 0) 80%
          );
          z-index: -1;
          opacity: 0;
          animation: glowFadeIn 2.5s ease-in-out forwards;
          animation-delay: 1.5s;
        }

        @keyframes glowFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Power cable */
        .power-cable {
          position: absolute;
          width: 4px;
          height: 40px;
          background-color: #333;
          bottom: -40px;
          right: 30px;
          z-index: -1;
        }

        .power-cable:after {
          content: '';
          position: absolute;
          width: 30px;
          height: 4px;
          background-color: #333;
          bottom: 0;
          right: -13px;
        }

        /* Text container spacing */
        .title-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 10px; /* Extra bottom padding */
        }
      `}</style>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="neon-container">
          {/* Corner decorations */}
          <div className="corner-decoration top-left"></div>
          <div className="corner-decoration top-right"></div>
          <div className="corner-decoration bottom-left"></div>
          <div className="corner-decoration bottom-right"></div>
          
          {/* Mounting bolts */}
          <div className="bolt bolt-1"></div>
          <div className="bolt bolt-2"></div>
          <div className="bolt bolt-3"></div>
          <div className="bolt bolt-4"></div>
          
          {/* Power cable */}
          <div className="power-cable"></div>
          
          {/* Glow effect */}
          <div className="neon-glow"></div>
          
          <div className="title-container">
            <div className="text-6xl md:text-7xl lg:text-8xl neon-sign anime">
              Anime
            </div>
            <div className="text-5xl md:text-6xl lg:text-7xl neon-sign verse">
              Verse
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeonTitle;