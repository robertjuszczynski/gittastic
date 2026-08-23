import { useEffect } from 'react'

export function useGitConfig(onResult: (name: string, email: string) => void) {
  useEffect(() => {
    onResult('', '')
  }, [])
}
