import { useState, useEffect } from 'react';

interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    highContrast: false,
    largeText: false,
  });

  useEffect(() => {
    // Detectar preferencia de movimiento reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({
      ...prev,
      prefersReducedMotion: mediaQuery.matches
    }));

    const handleChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        prefersReducedMotion: e.matches
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Permitir cambios manuales en las preferencias
  const togglePreference = (key: keyof AccessibilityPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Aplicar clases CSS basadas en las preferencias
  useEffect(() => {
    const html = document.documentElement;
    
    if (preferences.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    if (preferences.largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }
  }, [preferences.highContrast, preferences.largeText]);

  return {
    preferences,
    togglePreference
  };
};