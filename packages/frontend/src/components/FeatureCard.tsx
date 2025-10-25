import styled from 'styled-components';
import { motion } from 'framer-motion';
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

  return (
    <Card
      data-feature={id}
      whileHover={{ scale: isCompact ? 1 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      isCompact={isCompact}
    >
      <Icon isCompact={isCompact}>{icon}</Icon>
      <Content>
        <Title isCompact={isCompact}>{title}</Title>
        {!isCompact && <Description>{description}</Description>}
      </Content>
    </Card>
  );
}

const Card = styled(motion.div)<{ isCompact: boolean }>`
  padding: ${({ theme, isCompact }) => isCompact ? theme.spacing.md : theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: ${({ isCompact }) => isCompact ? 'center' : 'flex-start'};
  gap: ${({ theme }) => theme.spacing.md};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Icon = styled.div<{ isCompact: boolean }>`
  font-size: ${({ isCompact }) => isCompact ? '1.5rem' : '2.5rem'};
  flex-shrink: 0;
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
