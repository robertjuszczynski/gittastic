import type { TChannelKeys } from '@shared'

export const LOADING_LABELS: Partial<Record<TChannelKeys, string>> = {
  PUSH:            'Pushing',
  PULL:            'Pulling',
  FETCH:           'Fetching',
  STASH:           'Stashing',
  POP_STASH:       'Popping stash',
  UNDO:            'Undoing',
  REDO:            'Redoing',
  COMMIT:          'Committing',
  CHECKOUT_BRANCH: 'Checking out',
  CREATE_BRANCH: 'Creating branch',
}
