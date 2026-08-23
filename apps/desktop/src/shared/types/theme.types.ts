export type BuiltInThemeId =
  | 'gitastic-light'
  | 'gitastic-dark'
  | 'gitastic-glassmorphism'
  | 'system'

export type ThemeId = BuiltInThemeId | (string & {})

export interface ThemeColorTokens {
  bg: string
  surface: string
  surface2: string
  text: string
  textSecondary: string
  textMuted: string
  border: string
  divider: string
  neutral100: string
  neutral200: string
  neutral300: string
  neutral400: string
  neutral500: string
  neutral600: string
  neutral700: string
  neutral800: string
  neutral900: string
  accent: string
  accentDim: string
  accentGlow: string
  add: string
  addBg: string
  remove: string
  removeBg: string
}

export interface ThemeFontTokens {
  sans?: string
  mono?: string
}

export interface ThemeComponentTokens {
  toolbar?: {
    bg?: string
    border?: string
    text?: string
  }
  sidebar?: {
    bg?: string
    border?: string
    text?: string
  }
  divider?: {
    color?: string
  }
  slider?: {
    track?: string
    thumb?: string
    thumbHover?: string
  }
  scrollbar?: {
    thumb?: string
    track?: string
  }
  input?: {
    bg?: string
    border?: string
    focusBorder?: string
    text?: string
    placeholder?: string
  }
  button?: {
    bg?: string
    text?: string
    hoverBg?: string
    border?: string
  }
  modal?: {
    bg?: string
    overlay?: string
    border?: string
  }
  badge?: {
    bg?: string
    text?: string
  }
  tab?: {
    activeBg?: string
    activeText?: string
    inactiveText?: string
    border?: string
  }
  commitList?: {
    bg?: string
    hoverBg?: string
    activeBg?: string
  }
  diffAdd?: {
    bg?: string
    text?: string
  }
  diffRemove?: {
    bg?: string
    text?: string
  }
}

export interface ThemeExtras {
  [cssVar: string]: string
}

export interface ThemeTokens {
  colors: ThemeColorTokens
  fonts?: ThemeFontTokens
  components?: ThemeComponentTokens
  extras?: ThemeExtras
}

export interface ThemeDefinition {
  id: ThemeId
  name: string
  tokens: ThemeTokens
  isDark?: boolean
  isCustom?: boolean
  filePath?: string
}

export interface ThemeJSON {
  name: string
  base?: ThemeId
  colors?: Partial<ThemeColorTokens>
  fonts?: ThemeFontTokens
  components?: ThemeComponentTokens
  extras?: ThemeExtras
}
