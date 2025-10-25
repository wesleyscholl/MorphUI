import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { getPresetAdaptation } from '../services/presets';

interface DemoControlsProps {
  onRequestAdaptation: () => void;
  isAutoAdapting: boolean;
}

export function DemoControls({ onRequestAdaptation, isAutoAdapting }: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { demoMode, setDemoMode, resetToDefault, applyAdaptation } = useAppStore();

  const demoModes = [
    { id: null, label: 'Auto', emoji: '🤖', description: 'AI-driven adaptation' },
    { id: 'stress', label: 'Stressed', emoji: '😰', description: 'Simplified, calm UI' },
    { id: 'focus', label: 'Focused', emoji: '🎯', description: 'Minimal distractions' },
    { id: 'explorer', label: 'Explorer', emoji: '🔍', description: 'Rich, playful' },
    { id: 'relax', label: 'Relaxed', emoji: '😌', description: 'Spacious, comfortable' }
  ];

  const handleModeChange = (modeId: string | null) => {
    setDemoMode(modeId as any);
    
    // Apply preset adaptation if a demo mode is selected
    if (modeId && modeId !== 'auto') {
      const preset = getPresetAdaptation(modeId);
      if (preset) {
        applyAdaptation(preset.adaptation, preset.mood);
      }
    } else if (modeId === null) {
      // Reset to default when switching to auto mode
      resetToDefault();
    }
  };

  return (
    <Container>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🎮'} Demo
      </ToggleButton>

      <AnimatePresence>
        {isOpen && (
          <Panel
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <PanelTitle>Demo Controls</PanelTitle>
            
            <Section>
              <SectionTitle>Mode</SectionTitle>
              {demoModes.map((mode) => (
                <ModeButton
                  key={mode.id || 'auto'}
                  isActive={demoMode === mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  data-feature={`demo-${mode.id || 'auto'}`}
                >
                  <span>{mode.emoji}</span>
                  <div>
                    <ModeName>{mode.label}</ModeName>
                    <ModeDesc>{mode.description}</ModeDesc>
                  </div>
                </ModeButton>
              ))}
            </Section>

            <Section>
              <SectionTitle>Actions</SectionTitle>
              <ActionButton 
                onClick={onRequestAdaptation}
                disabled={!isAutoAdapting}
                data-feature="request-adaptation"
              >
                🔄 Request Adaptation
              </ActionButton>
              <ActionButton 
                onClick={resetToDefault}
                data-feature="reset-ui"
              >
                ↺ Reset to Default
              </ActionButton>
            </Section>

            <Info>
              {isAutoAdapting ? '✅ Auto-adaptation active' : '⏸️ Auto-adaptation paused'}
            </Info>
          </Panel>
        )}
      </AnimatePresence>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
`;

const ToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const Panel = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 0;
  width: 320px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const PanelTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ModeButton = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, isActive }) => isActive ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  transition: ${({ theme }) => theme.transitions.fast};

  span {
    font-size: 1.5rem;
  }

  &:hover {
    background-color: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : theme.colors.surface};
  }
`;

const ModeName = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

const ModeDesc = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Info = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;
