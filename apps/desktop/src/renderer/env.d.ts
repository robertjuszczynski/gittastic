/// <reference types="vite/client" />

export {}

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}

declare module 'framer-motion' {
  interface MotionStyle {
    WebkitAppRegion?: 'drag' | 'no-drag'
  }
}
