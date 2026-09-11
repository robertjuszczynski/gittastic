import { ipcMain } from 'electron'
import { ABORTABLE_CHANNELS } from '@shared/ipc/abortable-channels'
import { abortRequest } from '@main/registries/abort-registry'

// One cancel handler for every channel in ABORTABLE_CHANNELS — adding a channel there is enough, no handler to write per feature.
export default function registerCancelIpcHandlers() {
  for (const channel of ABORTABLE_CHANNELS) {
    ipcMain.handle(`CANCEL_${channel}`, (_, args: { requestId: string }) => {
      abortRequest(args.requestId)
    })
  }
}
