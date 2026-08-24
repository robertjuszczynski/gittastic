import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  ThemeColorTokens,
  ThemeComponentTokens,
  ThemeDefinition,
  ThemeExtras,
  ThemeFontTokens,
  ThemeId,
  ThemeJSON,
} from '@shared'
import { BUILT_IN_THEME_MAP, mergeThemeTokens } from '@shared'
import { injectTheme } from '@renderer/shared/lib/theme'
import { useThemeStore } from '../model/useThemeStore'

export type EditorMode =
  | { mode: 'create' }
  | { mode: 'edit'; themeId: ThemeId }
  | { mode: 'duplicate'; themeId: ThemeId }

export function useThemeEditor(editorMode: EditorMode) {
  const previousTheme = useRef(useThemeStore.getState().activeTheme)

  const [name, setName] = useState('')
  const [base, setBase] = useState<ThemeId>('gitastic-light')
  const [colorOverrides, setColorOverrides] = useState<Partial<ThemeColorTokens>>({})
  const [fontOverrides, setFontOverrides] = useState<ThemeFontTokens>({})
  const [componentOverrides, setComponentOverrides] = useState<ThemeComponentTokens>({})
  const [extras, setExtras] = useState<ThemeExtras>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (editorMode.mode === 'create') {
        setIsLoading(false)
        return
      }

      const json = await window.electron.GET_THEME_JSON(editorMode.themeId)

      if (editorMode.mode === 'edit' && json) {
        setName(json.name)
        setBase(json.base ?? 'gitastic-light')
        setColorOverrides(json.colors ?? {})
        setFontOverrides(json.fonts ?? {})
        setComponentOverrides(json.components ?? {})
        setExtras(json.extras ?? {})
      } else if (editorMode.mode === 'duplicate') {
        const builtIn = BUILT_IN_THEME_MAP.get(editorMode.themeId)
        if (builtIn) {
          setName(`${builtIn.name} Copy`)
          setBase(editorMode.themeId)
        } else if (json) {
          setName(`${json.name} Copy`)
          setBase(json.base ?? 'gitastic-light')
          setColorOverrides(json.colors ?? {})
          setFontOverrides(json.fonts ?? {})
          setComponentOverrides(json.components ?? {})
          setExtras(json.extras ?? {})
        }
      }

      setIsLoading(false)
    }
    load()
  }, [])

  const baseTheme = BUILT_IN_THEME_MAP.get(base) ?? BUILT_IN_THEME_MAP.get('gitastic-light')!

  const effectiveTokens = mergeThemeTokens(baseTheme.tokens, {
    name,
    colors: colorOverrides,
    fonts: fontOverrides,
    components: componentOverrides,
    extras,
  })

  useEffect(() => {
    injectTheme({ id: '__preview__', name, tokens: effectiveTokens })
  }, [JSON.stringify(effectiveTokens)])

  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'custom-theme'

  const setColor = useCallback((key: keyof ThemeColorTokens, value: string) => {
    setColorOverrides(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetColor = useCallback((key: keyof ThemeColorTokens) => {
    setColorOverrides(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const setComponentToken = useCallback(
    <C extends keyof ThemeComponentTokens, K extends keyof NonNullable<ThemeComponentTokens[C]>>(
      component: C,
      key: K,
      value: string
    ) => {
      setComponentOverrides(prev => ({
        ...prev,
        [component]: {
          ...(prev[component] ?? {}),
          [key]: value,
        },
      }))
    },
    []
  )

  const setFont = useCallback((key: keyof ThemeFontTokens, value: string) => {
    setFontOverrides(prev => ({ ...prev, [key]: value }))
  }, [])

  const setExtra = useCallback((key: string, value: string) => {
    setExtras(prev => ({ ...prev, [key]: value }))
  }, [])

  const removeExtra = useCallback((key: string) => {
    setExtras(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const changeBase = useCallback((newBase: ThemeId) => {
    setBase(newBase)
  }, [])

  const toThemeJSON = (): ThemeJSON => ({
    name,
    base,
    ...(Object.keys(colorOverrides).length > 0 && { colors: colorOverrides }),
    ...(Object.keys(fontOverrides).length > 0 && { fonts: fontOverrides }),
    ...(Object.keys(componentOverrides).length > 0 && { components: componentOverrides }),
    ...(Object.keys(extras).length > 0 && { extras }),
  })

  const save = async (): Promise<ThemeDefinition> => {
    const themeSlug = editorMode.mode === 'edit' ? (editorMode.themeId as string) : slug
    return window.electron.SAVE_THEME({ slug: themeSlug, json: toThemeJSON() })
  }

  const cancel = () => {
    const prev = previousTheme.current
    if (prev) injectTheme(prev)
  }

  const exportJson = () =>
    window.electron.EXPORT_THEME(
      editorMode.mode === 'edit' ? editorMode.themeId : (slug as ThemeId)
    )

  const deleteTheme = async () => {
    if (editorMode.mode !== 'edit') return
    await window.electron.DELETE_CUSTOM_THEME(editorMode.themeId)
  }

  return {
    isLoading,
    name,
    setName,
    base,
    changeBase,
    colorOverrides,
    setColor,
    resetColor,
    fontOverrides,
    setFont,
    componentOverrides,
    setComponentToken,
    extras,
    setExtra,
    removeExtra,
    effectiveTokens,
    baseTheme,
    slug,
    save,
    cancel,
    exportJson,
    deleteTheme,
  }
}
