// Channels that support cancellation. Add a channel here and it gets a CANCEL_<channel>
// IPC handler automatically (see register-cancel-ipc-handlers.ts) — no per-channel wiring needed.
export const ABORTABLE_CHANNELS = [] as const

export type TAbortableChannel = typeof ABORTABLE_CHANNELS[number]
export type TCancelChannel<C extends string = TAbortableChannel> = `CANCEL_${C}`
