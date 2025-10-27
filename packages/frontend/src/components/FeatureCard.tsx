import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { LayoutType } from '../types';

interface FeatureCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  layout: LayoutType;
}

export function FeatureCard({ id, icon, title, description, layout }: FeatureCardProps) {
  const isCompact = layout === 'list';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      data-feature={id}
      whileHover={{ scale: isCompact ? 1 : 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      isCompact={isCompact}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardGlow isHovered={isHovered} />
      <CardContent>
        <IconWrapper isCompact={isCompact}>
          <IconBackground />
          <Icon>{icon}</Icon>
        </IconWrapper>
        <Content>
          <Title isCompact={isCompact}>{title}</Title>
          {!isCompact && <Description>{description}</Description>}
        </Content>
      </CardContent>
      {!isCompact && (
        <CornerDecoration>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path
              d="M0,40 Q0,0 40,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.2"
            />
          </svg>
        </CornerDecoration>
      )}
    </Card>
  );
}

const Card = styled(motion.div)<{ isCompact: boolean }>`
  position: relative;
  padding: ${({ theme, isCompact }) => isCompact ? theme.spacing.md : theme.spacing.xl};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.surface}dd, ${theme.colors.background}dd)`};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme, isCompact }) => isCompact ? theme.borderRadius : '16px'};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: ${({ isCompact }) => isCompact ? 'center' : 'flex-start'};
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.surface}ff, ${theme.colors.background}ff)`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary},
      ${({ theme }) => theme.colors.accent}
    );
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardGlow = styled.div<{ isHovered: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, ${({ theme }) => theme.colors.primary}30 0%, transparent 70%);
  opacity: ${({ isHovered }) => isHovered ? 0.5 : 0};
  transform: translate(-50%, -50%) scale(${({ isHovered }) => isHovered ? 1 : 0.8});
  transition: all 0.5s ease;
  pointer-events: none;
  filter: blur(20px);
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const IconWrapper = styled.div<{ isCompact: boolean }>`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ isCompact }) => isCompact ? '40px' : '56px'};
  height: ${({ isCompact }) => isCompact ? '40px' : '56px'};
`;

const IconBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`};
  border-radius: 12px;
  transform: rotate(45deg);
  transition: all ${({ theme }) => theme.transitions.normal};

  ${Card}:hover & {
    transform: rotate(135deg) scale(1.1);
    background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.secondary}30)`};
  }
`;

const Icon = styled.div`
  position: relative;
  font-size: 1.75rem;
  z-index: 1;
  transition: transform ${({ theme }) => theme.transitions.normal};

  ${Card}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const CornerDecoration = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.5;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${Card}:hover & {
    opacity: 0.8;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3<{ isCompact: boolean }>`
  font-size: ${({ isCompact }) => isCompact ? '1rem' : '1.25rem'};
  margin-bottom: ${({ theme, isCompact }) => isCompact ? '0' : theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;
