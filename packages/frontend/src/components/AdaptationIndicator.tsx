import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

export function AdaptationIndicator() {
  const { isAdapting } = useAppStore();

  return (
    <AnimatePresence>
      {isAdapting && (
        <Indicator
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
        >
          <OrbContainer>
            <GradientOrb1 />
            <GradientOrb2 />
            <GradientOrb3 />
            <SpinnerRing />
          </OrbContainer>
          <TextContent>
            <MainText>Adapting UI</MainText>
            <SubText>AI is personalizing your experience</SubText>
          </TextContent>
        </Indicator>
      )}
    </AnimatePresence>
  );
}

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`;

const Indicator = styled(motion.div)`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.surface}dd, ${theme.colors.background}dd)`};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  box-shadow: 0 8px 32px ${({ theme }) => theme.colors.primary}40,
              0 0 0 1px ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  animation: ${float} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 20px;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary},
      ${({ theme }) => theme.colors.accent}
    );
    opacity: 0.5;
    filter: blur(8px);
    z-index: -1;
  }

  @media (max-width: 768px) {
    bottom: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const OrbContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
`;

const GradientOrb1 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  background: radial-gradient(circle, 
    ${({ theme }) => theme.colors.primary}ff, 
    ${({ theme }) => theme.colors.primary}00
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 2s ease-in-out infinite;
  filter: blur(4px);
`;

const GradientOrb2 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, 
    ${({ theme }) => theme.colors.secondary}80, 
    ${({ theme }) => theme.colors.secondary}00
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 2.5s ease-in-out infinite;
  animation-delay: -0.5s;
  filter: blur(6px);
`;

const GradientOrb3 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48px;
  height: 48px;
  background: radial-gradient(circle, 
    ${({ theme }) => theme.colors.accent}60, 
    ${({ theme }) => theme.colors.accent}00
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${pulse} 3s ease-in-out infinite;
  animation-delay: -1s;
  filter: blur(8px);
`;

const SpinnerRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  border: 3px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-right-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${spin} 1.5s linear infinite;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainText = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SubText = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;
