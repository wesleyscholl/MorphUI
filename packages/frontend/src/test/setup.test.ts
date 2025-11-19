/**
 * Sample test to verify testing setup
 */
import { describe, it, expect } from 'vitest';

describe('MorphUI Testing Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello, MorphUI!';
    expect(greeting).toContain('MorphUI');
    expect(greeting.length).toBeGreaterThan(0);
  });

  it('should work with objects', () => {
    const config = {
      theme: 'dark',
      mood: 'focused',
      adaptiveMode: true,
    };

    expect(config).toHaveProperty('theme');
    expect(config.theme).toBe('dark');
    expect(config.adaptiveMode).toBeTruthy();
  });

  it('should work with arrays', () => {
    const moods = ['relaxed', 'focused', 'stressed'];
    
    expect(moods).toHaveLength(3);
    expect(moods).toContain('focused');
    expect(moods[0]).toBe('relaxed');
  });
});
