export const CHANNELS = {
  OPEN_WORKSPACE: 'OPEN_WORKSPACE',
  GET_WORKSPACES: 'GET_WORKSPACES',
} as const

export type TChannelKeys = keyof typeof CHANNELS;