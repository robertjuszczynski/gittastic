import type { TChannelKeys } from '@shared'
import { LOADING_LABELS } from './loading-labels'
import { useLoadingStore } from './loading-store'

/**
 * Wraps an async function with a global loading indicator tied to an IPC channel.
 * Starts a named loading entry before the call and finishes it when the promise settles.
 */
export function withGlobalIndicator<TArgs extends unknown[], TReturn extends Promise<unknown>>(
  channelOrLabel: TChannelKeys | string,
  fn: (...args: TArgs) => TReturn,
  totalSteps = 1
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    const id = crypto.randomUUID()
    const label = LOADING_LABELS[channelOrLabel as TChannelKeys] ?? channelOrLabel
    useLoadingStore.getState().start(id, label, totalSteps)
    return fn(...args).finally(() => {
      useLoadingStore.getState().finish(id)
    }) as TReturn
  }
}
