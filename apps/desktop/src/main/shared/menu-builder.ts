import type { MenuItemConstructorOptions } from 'electron'

type ActionItem = {
  label: string
  click: () => void
  enabled?: boolean
  visible?: boolean
}

type SeparatorItem = {
  type: 'separator'
  visible?: boolean
}

export type MenuItemDef = ActionItem | SeparatorItem

export function buildMenuTemplate(items: MenuItemDef[]): MenuItemConstructorOptions[] {
  return items
    .filter(item => item.visible !== false)
    .map(({ visible: _, ...item }) => item as MenuItemConstructorOptions)
}
