import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export function AnimatedLogo() {
  return (
    <LogoContainer
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring with gradient */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated outer circle */}
        <OuterCircle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="314"
          strokeDashoffset="0"
          filter="url(#glow)"
        />

        {/* Middle circle */}
        <MiddleCircle
          cx="60"
          cy="60"
          r="35"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="220"
          strokeDashoffset="0"
          opacity="0.7"
        />

        {/* Inner morphing shape */}
        <InnerShape
          d="M60,30 Q75,45 60,60 Q45,75 60,90 Q75,75 60,60 Q45,45 60,30Z"
          fill="url(#gradient1)"
          opacity="0.3"
        />

        {/* Center dot with pulse */}
        <CenterDot
          cx="60"
          cy="60"
          r="5"
          fill="url(#gradient1)"
          filter="url(#glow)"
        />

        {/* Orbital dots */}
        <OrbitDot1
          cx="60"
          cy="15"
          r="3"
          fill="#6366f1"
        />
        <OrbitDot2
          cx="105"
          cy="60"
          r="3"
          fill="#8b5cf6"
        />
        <OrbitDot3
          cx="60"
          cy="105"
          r="3"
          fill="#ec4899"
        />
        <OrbitDot4
          cx="15"
          cy="60"
          r="3"
          fill="#10b981"
        />
      </svg>
    </LogoContainer>
  );
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rotateReverse = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(45px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(45px) rotate(-360deg); }
`;

const LogoContainer = styled(motion.div)`
  display: inline-block;
  margin-bottom: 2rem;
`;

const OuterCircle = styled.circle`
  animation: ${rotate} 8s linear infinite;
  transform-origin: center;
`;

const MiddleCircle = styled.circle`
  animation: ${rotateReverse} 6s linear infinite;
  transform-origin: center;
`;

const InnerShape = styled.path`
  animation: ${pulse} 3s ease-in-out infinite;
  transform-origin: center;
`;

const CenterDot = styled.circle`
  animation: ${pulse} 2s ease-in-out infinite;
`;

const OrbitDot1 = styled.circle`
  animation: ${orbit} 4s linear infinite;
  transform-origin: 60px 60px;
`;

const OrbitDot2 = styled.circle`
  animation: ${orbit} 5s linear infinite;
  transform-origin: 60px 60px;
  animation-delay: -1.25s;
`;

const OrbitDot3 = styled.circle`
  animation: ${orbit} 6s linear infinite;
  transform-origin: 60px 60px;
  animation-delay: -2.5s;
`;

const OrbitDot4 = styled.circle`
  animation: ${orbit} 4.5s linear infinite;
  transform-origin: 60px 60px;
  animation-delay: -3.75s;
`;
