const LogoBranchIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <circle cx="3.5" cy="3.5" r="1.75" fill="currentColor" />
    <circle cx="3.5" cy="10.5" r="1.75" fill="currentColor" />
    <circle cx="10.5" cy="4.5" r="1.75" fill="currentColor" />
    <line x1="3.5" y1="5.25" x2="3.5" y2="8.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M3.5 5.25 C3.5 7 7 6 10.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
)

export default LogoBranchIcon
