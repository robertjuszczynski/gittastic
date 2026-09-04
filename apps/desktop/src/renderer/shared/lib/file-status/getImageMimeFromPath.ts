const IMAGE_MIME_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  avif: 'image/avif',
}

export function getImageMimeFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  return (ext && IMAGE_MIME_BY_EXTENSION[ext]) || 'image/png'
}
