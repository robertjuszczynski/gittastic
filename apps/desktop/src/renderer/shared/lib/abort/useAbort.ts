import { useRef } from 'react'

export default function useAbort() {
  const requestIdRef = useRef<string | null>(null)

  const start = () => {
    const requestId = crypto.randomUUID()
    requestIdRef.current = requestId
    return requestId
  }

  const finish = (requestId: string) => {
    if (requestIdRef.current === requestId) requestIdRef.current = null
  }

  return { start, finish, requestIdRef }
}
