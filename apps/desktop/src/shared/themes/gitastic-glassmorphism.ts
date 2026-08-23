import type { ThemeDefinition } from '../types/theme.types'

export const gitasticGlassmorphism: ThemeDefinition = {
  id: 'gitastic-glassmorphism',
  name: 'Gitastic Glassmorphism',
  isDark: true,
  tokens: {
    colors: {
      bg: '#0a0b1a',
      surface: 'rgba(255, 255, 255, 0.06)',
      surface2: 'rgba(255, 255, 255, 0.10)',
      text: '#eef0ff',
      textSecondary: '#a8afd4',
      textMuted: '#565d80',
      border: 'rgba(255, 255, 255, 0.12)',
      divider: 'rgba(255, 255, 255, 0.07)',
      neutral100: '#eef0ff',
      neutral200: '#c8ccee',
      neutral300: '#a8afd4',
      neutral400: '#7a82a8',
      neutral500: '#565d80',
      neutral600: '#3a3f60',
      neutral700: '#252a48',
      neutral800: '#181d38',
      neutral900: '#0f1226',
      accent: '#7c6af5',
      accentDim: 'rgba(124, 106, 245, 0.15)',
      accentGlow: 'rgba(124, 106, 245, 0.08)',
      add: '#4ade9a',
      addBg: 'rgba(74, 222, 154, 0.1)',
      remove: '#f87171',
      removeBg: 'rgba(248, 113, 113, 0.1)',
    },
    fonts: {
      sans: 'ui-sans-serif, -apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", "Fira Code", Menlo, monospace',
    },
    components: {
      toolbar: {
        bg: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.10)',
      },
      sidebar: {
        bg: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.08)',
      },
      modal: {
        bg: 'rgba(15, 18, 38, 0.85)',
        overlay: 'rgba(0, 0, 0, 0.6)',
        border: 'rgba(255, 255, 255, 0.14)',
      },
    },
    extras: {
      '--surface-blur': 'blur(20px)',
      '--surface-saturate': 'saturate(180%)',
      '--surface-border-glow': '0 0 0 1px rgba(124, 106, 245, 0.2)',
    },
  },
}
