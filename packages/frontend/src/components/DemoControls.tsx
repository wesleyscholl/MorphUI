import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { getPresetAdaptation } from '../services/presets';
import { generateTheme } from '../services/api';
import { PRESET_THEMES } from '../constants/presetThemes';
import type { GeneratedTheme } from '../types';

interface DemoControlsProps {
  onRequestAdaptation: () => void;
  isAutoAdapting: boolean;
}

export function DemoControls({ onRequestAdaptation, isAutoAdapting }: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'modes' | 'themes' | 'actions'>('modes');
  const [themePrompt, setThemePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const { demoMode, setDemoMode, resetToDefault, applyAdaptation, applyCustomTheme } = useAppStore();

  const demoModes = [
    { id: null, label: 'Auto', emoji: '🤖', description: 'AI-driven adaptation' },
    { id: 'stress', label: 'Stressed', emoji: '😰', description: 'Simplified, calm UI' },
    { id: 'focus', label: 'Focused', emoji: '🎯', description: 'Minimal distractions' },
    { id: 'explorer', label: 'Explorer', emoji: '🔍', description: 'Rich, playful' },
    { id: 'relax', label: 'Relaxed', emoji: '😌', description: 'Spacious, comfortable' }
  ];

  const fallbackThemes = [
    { id: 'dark', label: 'Dark', emoji: '🌙' },
    { id: 'dark-forest', label: 'Dark Forest', emoji: '🌲' },
    { id: 'midnight-ocean', label: 'Midnight Ocean', emoji: '🌊' },
    { id: 'dark-purple', label: 'Dark Purple', emoji: '💜' },
    { id: 'light-nature', label: 'Light Nature', emoji: '🌿' },
    { id: 'light-ocean', label: 'Ocean Breeze', emoji: '🏖️' },
    { id: 'sunset', label: 'Sunset', emoji: '🌅' },
    { id: 'light', label: 'Light', emoji: '☀️' }
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

  const handleGenerateTheme = async () => {
    if (!themePrompt.trim()) {
      setGenerationError('Please enter a theme prompt');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedTheme(null);

    try {
      const response = await generateTheme({
        prompt: themePrompt
      });

      setGeneratedTheme(response.theme);
      
      // Automatically apply the generated theme
      if (applyCustomTheme) {
        applyCustomTheme(response.theme);
      }

    } catch (error: any) {
      console.error('Theme generation error:', error);
      
      // Handle rate limiting
      if (error?.response?.status === 429) {
        setGenerationError('⏱️ Too many requests. Please wait a moment and try again.');
      } else if (error?.response?.status === 500) {
        setGenerationError('🔧 Server error. The theme generator may be unavailable.');
      } else if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
        setGenerationError('🔌 Cannot connect to theme generator. Make sure Ollama is running.');
      } else {
        setGenerationError(error instanceof Error ? error.message : 'Failed to generate theme');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetTheme = (themeId: string) => {
    const theme = PRESET_THEMES[themeId];
    if (theme && applyCustomTheme) {
      setGeneratedTheme(theme);
      setGenerationError(null);
      applyCustomTheme(theme);
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
            <PanelHeader>
              <PanelTitle>Demo Controls</PanelTitle>
              <TabBar>
                <Tab 
                  isActive={activeTab === 'modes'} 
                  onClick={() => setActiveTab('modes')}
                >
                  🎭 Modes
                </Tab>
                <Tab 
                  isActive={activeTab === 'themes'} 
                  onClick={() => setActiveTab('themes')}
                >
                  🎨 Themes
                </Tab>
                <Tab 
                  isActive={activeTab === 'actions'} 
                  onClick={() => setActiveTab('actions')}
                >
                  ⚡ Actions
                </Tab>
              </TabBar>
            </PanelHeader>

            <ScrollableContent>
              {activeTab === 'modes' && (
                <Section>
                  <SectionTitle>Behavior Modes</SectionTitle>
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
              )}

              {activeTab === 'themes' && (
                <>
                  <Section>
                    <SectionTitle>🎨 Generate Custom Theme</SectionTitle>
                    <ThemeInput
                      type="text"
                      placeholder="e.g., dark cyberpunk neon theme"
                      value={themePrompt}
                      onChange={(e) => setThemePrompt(e.target.value)}
                      disabled={isGenerating}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isGenerating && themePrompt.trim()) {
                          handleGenerateTheme();
                        }
                      }}
                    />
                    <ActionButton
                      onClick={handleGenerateTheme}
                      disabled={isGenerating || !themePrompt.trim()}
                      data-feature="generate-theme"
                    >
                      {isGenerating ? '⏳ Generating...' : '✨ Generate Theme'}
                    </ActionButton>
                    
                    {generationError && (
                      <ErrorMessage>
                        {generationError}
                        {generationError.includes('Too many requests') && (
                          <div style={{ marginTop: '8px', fontSize: '0.7rem' }}>
                            💡 Try using a preset theme below while you wait!
                          </div>
                        )}
                      </ErrorMessage>
                    )}
                    
                    {generatedTheme && (
                      <SuccessMessage>
                        ✅ Generated "{generatedTheme.name}" theme!
                      </SuccessMessage>
                    )}
                  </Section>

                  <Section>
                    <SectionTitle>📚 Preset Themes</SectionTitle>
                    <ThemeGrid>
                      {fallbackThemes.map((theme) => (
                        <ThemeButton
                          key={theme.id}
                          onClick={() => handlePresetTheme(theme.id)}
                          data-feature={`theme-${theme.id}`}
                        >
                          <span>{theme.emoji}</span>
                          <ThemeName>{theme.label}</ThemeName>
                        </ThemeButton>
                      ))}
                    </ThemeGrid>
                  </Section>
                </>
              )}

              {activeTab === 'actions' && (
                <>
                  <Section>
                    <SectionTitle>Adaptation Controls</SectionTitle>
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
                </>
              )}
            </ScrollableContent>
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
  max-height: calc(100vh - 100px);
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const ScrollableContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
`;

const TabBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary : theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ThemeButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryLight || theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    font-size: 1.5rem;
  }
`;

const ThemeName = styled.div`
  font-size: 0.75rem;
  text-align: center;
`;

const PanelTitle = styled.h3`
  margin: 0;
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

const ThemeInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.error}15;
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
`;

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.success}15;
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.success}40;
`;
