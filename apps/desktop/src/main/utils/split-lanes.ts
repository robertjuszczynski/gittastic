export function splitLines(s: string): string[] {
  if (!s) return []
  const lines = s.split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  return lines
}