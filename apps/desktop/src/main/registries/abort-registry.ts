const controllers = new Map<string, AbortController>()

// Runs fn with an AbortSignal keyed by requestId, so a separate IPC call (abortRequest) can cancel it later.
export async function withAbort<T>(requestId: string, fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController()
  controllers.set(requestId, controller)

  try {
    return await fn(controller.signal)
  } finally {
    controllers.delete(requestId)
  }
}

export function abortRequest(requestId: string): void {
  controllers.get(requestId)?.abort()
}
