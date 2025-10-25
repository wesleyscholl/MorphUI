import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { FeatureCard } from './FeatureCard';

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
      <Header>
        <Title>🧬 MorphUI</Title>
        <Subtitle>Adaptive Interface</Subtitle>
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
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
`;

const MoodBadge = styled.div<{ mood: string }>`
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, mood }) => {
    const colors: Record<string, string> = {
      stressed: theme.colors.error,
      focused: theme.colors.primary,
      relaxed: theme.colors.success,
      exploratory: theme.colors.accent,
      frustrated: theme.colors.warning
    };
    return colors[mood] || theme.colors.primary;
  }};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  text-transform: capitalize;
  transition: ${({ theme }) => theme.transitions.normal};
`;

const AdaptationInfo = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FeaturesGrid = styled.div<{ layout: string; columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  gap: ${({ theme }) => theme.spacing.lg};
  
  ${({ layout }) => layout === 'list' && `
    gap: 12px;
  `}
  
  ${({ layout }) => layout === 'timeline' && `
    max-width: 800px;
    margin: 0 auto;
  `}
  
  @media (max-width: 1024px) {
    grid-template-columns: ${({ columns }) => `repeat(${Math.max(2, columns - 1)}, 1fr)`};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
