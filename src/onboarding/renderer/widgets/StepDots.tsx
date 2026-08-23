const StepDots = ({ current, total }: { current: number; total: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        height: 3,
        width: i === current ? 20 : 12,
        borderRadius: 2,
        background: i === current ? 'var(--color-accent)' : i < current ? 'var(--color-neutral-600)' : 'var(--color-neutral-800)',
        transition: 'width 0.25s ease, background 0.25s ease',
      }} />
    ))}
  </div>
)

export default StepDots
