export const getFileExtensionFromPath = (path: string): string | null => {
  const fileName = path.split('/').pop() ?? path
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) return null
  return fileName.substring(dotIndex)
}