import type { WebContents } from 'electron'
import type { TMainEvents } from '@shared'

export function sendToRenderer<K extends keyof TMainEvents>(
  webContents: WebContents,
  event: K,
  ...args: TMainEvents[K] extends void ? [] : [TMainEvents[K]]
): void {
  webContents.send(event, ...args)
}
