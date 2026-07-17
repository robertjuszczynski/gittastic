export const CHANNELS ={
  OPEN_WORKSPACE: 'OPEN_WORKSPACE'
} as const

export type TChannelKeys = keyof typeof CHANNELS;