import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { FeatureCard } from './FeatureCard';
import { AnimatedLogo } from './AnimatedLogo';
import { ParticleBackground } from './ParticleBackground';

const features = {
  dashboard: { icon: '📊', title: 'Dashboard', description: 'Overview and key metrics' },
  analytics: { icon: '📈', title: 'Analytics', description: 'Deep insights and trends' },
  calendar: { icon: '📅', title: 'Calendar', description: 'Schedule and events' },
  tasks: { icon: '✅', title: 'Tasks', description: 'To-dos and projects' },
  notes: { icon: '📝', title: 'Notes', description: 'Quick notes and ideas' },
  settings: { icon: '⚙️', title: 'Settings', description: 'App configuration' },
  notifications: { icon: '🔔', title: 'Notifications', description: 'Recent alerts' },
  search: { icon: '🔍', title: 'Search', description: 'Find anything' },
  help: { icon: '❓', title: 'Help', description: 'Support and docs' },
  profile: { icon: '👤', title: 'Profile', description: 'User information' },
  chat: { icon: '💬', title: 'Chat', description: 'Team messaging' },
  reports: { icon: '📊', title: 'Reports', description: 'Generate reports' },
  files: { icon: '📁', title: 'Files', description: 'Document storage' },
  team: { icon: '👥', title: 'Team', description: 'Team members' },
  activity: { icon: '⚡', title: 'Activity', description: 'Recent activity feed' }
};

export function Dashboard() {
  const { layout, visibleFeatures, complexity, currentMood, adaptationReasoning } = useAppStore();

  const layoutConfig = {
    grid: { columns: complexity === 'simple' ? 2 : complexity === 'moderate' ? 3 : 4 },
    list: { columns: 1 },
    cards: { columns: complexity === 'simple' ? 1 : complexity === 'moderate' ? 2 : 3 },
    timeline: { columns: 1 },
    kanban: { columns: 3 }
  };

  return (
    <Container>
      <ParticleBackground />
      <Header>
        <AnimatedLogo />
        <TitleGroup>
          <Title>MorphUI</Title>
          <Subtitle>Adaptive Interface · Powered by AI</Subtitle>
        </TitleGroup>
        {currentMood && (
          <MoodBadge mood={currentMood.mood}>
            {getMoodEmoji(currentMood.mood)} {currentMood.mood}
          </MoodBadge>
        )}
      </Header>

      {adaptationReasoning && (
        <AdaptationInfo
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          💡 {adaptationReasoning}
        </AdaptationInfo>
      )}

      <FeaturesGrid layout={layout} columns={layoutConfig[layout].columns}>
        <AnimatePresence mode="popLayout">
          {visibleFeatures.map((featureId, index) => {
            const feature = features[featureId as keyof typeof features];
            if (!feature) return null;

            return (
              <motion.div
                key={featureId}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <FeatureCard
                  id={featureId}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  layout={layout}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </FeaturesGrid>
    </Container>
  );
}

function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    stressed: '😰',
    focused: '🎯',
    relaxed: '😌',
    exploratory: '🔍',
    frustrated: '😤'
  };
  return emojis[mood] || '🙂';
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.header`
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.accent}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  text-shadow: 0 0 40px ${({ theme }) => theme.colors.primary}40;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const MoodBadge = styled.div<{ mood: string }>`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, mood }) => {
    const colors: Record<string, string> = {
      stressed: theme.colors.error,
      focused: theme.colors.primary,
      relaxed: theme.colors.success,
      exploratory: theme.colors.accent,
      frustrated: theme.colors.warning
    };
    return `linear-gradient(135deg, ${colors[mood] || theme.colors.primary}, ${colors[mood] || theme.colors.primary}dd)`;
  }};
  color: white;
  border-radius: 24px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: 0 4px 12px ${({ theme, mood }) => {
    const colors: Record<string, string> = {
      stressed: theme.colors.error,
      focused: theme.colors.primary,
      relaxed: theme.colors.success,
      exploratory: theme.colors.accent,
      frustrated: theme.colors.warning
    };
    return `${colors[mood] || theme.colors.primary}40`;
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${({ theme, mood }) => {
      const colors: Record<string, string> = {
        stressed: theme.colors.error,
        focused: theme.colors.primary,
        relaxed: theme.colors.success,
        exploratory: theme.colors.accent,
        frustrated: theme.colors.warning
      };
      return `${colors[mood] || theme.colors.primary}50`;
    }};
  }
`;

const AdaptationInfo = styled(motion.div)`
  position: relative;
  z-index: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.surface}cc, ${theme.colors.background}cc)`};
  backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  font-size: 1rem;
  line-height: 1.6;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary}60, 
      ${({ theme }) => theme.colors.secondary}60
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const FeaturesGrid = styled.div<{ layout: string; columns: number }>`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  gap: ${({ theme }) => theme.spacing.xl};
  
  ${({ layout }) => layout === 'list' && `
    gap: 16px;
  `}
  
  ${({ layout }) => layout === 'timeline' && `
    max-width: 900px;
    margin: 0 auto;
  `}
  
  @media (max-width: 1024px) {
    grid-template-columns: ${({ columns }) => `repeat(${Math.max(2, columns - 1)}, 1fr)`};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
