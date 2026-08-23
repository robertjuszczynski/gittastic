import type { ThemeDefinition } from '@shared'

export const gitasticDark: ThemeDefinition = {
  id: 'gitastic-dark',
  name: 'Gitastic Dark',
  tokens: {
    colors: {
      bg: '#0d0e11',
      surface: '#161820',
      surface2: '#1e2028',
      text: '#e2e4f0',
      textSecondary: '#9ea3bc',
      textMuted: '#525770',
      border: 'rgba(255, 255, 255, 0.08)',
      divider: 'rgba(255, 255, 255, 0.06)',
      neutral100: '#e2e4f0',
      neutral200: '#c4c8dc',
      neutral300: '#9ea3bc',
      neutral400: '#787d96',
      neutral500: '#525770',
      neutral600: '#3a3e52',
      neutral700: '#272b3a',
      neutral800: '#1e2028',
      neutral900: '#161820',
      accent: '#4f8ef7',
      accentDim: 'rgba(79, 142, 247, 0.12)',
      accentGlow: 'rgba(79, 142, 247, 0.06)',
      add: '#3db87a',
      addBg: 'rgba(61, 184, 122, 0.1)',
      remove: '#f07070',
      removeBg: 'rgba(240, 112, 112, 0.1)',
    },
    fonts: {
      sans: 'ui-sans-serif, -apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", "Fira Code", Menlo, monospace',
    },
  },
}
