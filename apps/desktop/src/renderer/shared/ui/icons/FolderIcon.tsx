import React from 'react'

const OPEN_PATH = 'M1.5 4.5C1.5 3.95 1.95 3.5 2.5 3.5H4.88C5.15 3.5 5.41 3.61 5.59 3.8L6.41 4.7C6.59 4.89 6.85 5 7.12 5H10.5C11.05 5 11.5 5.45 11.5 6V9.5C11.5 10.05 11.05 10.5 10.5 10.5H2.5C1.95 10.5 1.5 10.05 1.5 9.5V4.5Z'
const CLOSED_PATH = 'M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5H4.88C5.15 2.5 5.41 2.61 5.59 2.8L6.41 3.7C6.59 3.89 6.85 4 7.12 4H10.5C11.05 4 11.5 4.45 11.5 5V9.5C11.5 10.05 11.05 10.5 10.5 10.5H2.5C1.95 10.5 1.5 10.05 1.5 9.5V3.5Z'

const FolderIcon = ({ open = false }: { open?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d={open ? OPEN_PATH : CLOSED_PATH} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
  </svg>
)

export default FolderIcon
