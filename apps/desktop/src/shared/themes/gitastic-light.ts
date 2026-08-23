import type { ThemeDefinition } from '../types/theme.types'

export const gitasticLight: ThemeDefinition = {
  id: 'gitastic-light',
  name: 'Gitastic Light',
  tokens: {
    colors: {
      bg: '#ffffff',
      surface: '#f5f6fa',
      surface2: '#eceef5',
      text: '#111318',
      textSecondary: '#4a4f66',
      textMuted: '#8e93a8',
      border: 'rgba(0, 0, 0, 0.08)',
      divider: 'rgba(0, 0, 0, 0.07)',
      neutral100: '#111318',
      neutral200: '#2c3040',
      neutral300: '#4a4f66',
      neutral400: '#6b7088',
      neutral500: '#8e93a8',
      neutral600: '#b4b8cc',
      neutral700: '#d4d7e8',
      neutral800: '#e4e6f2',
      neutral900: '#f0f1f8',
      accent: '#1b70f8',
      accentDim: 'rgba(27, 112, 248, 0.1)',
      accentGlow: 'rgba(27, 112, 248, 0.06)',
      add: '#1a7f4b',
      addBg: 'rgba(26, 127, 75, 0.08)',
      remove: '#c93a3a',
      removeBg: 'rgba(201, 58, 58, 0.08)',
    },
    fonts: {
      sans: 'ui-sans-serif, -apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      mono: 'ui-monospace, "SF Mono", "Fira Code", Menlo, monospace',
    },
  },
}
