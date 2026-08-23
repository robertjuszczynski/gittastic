import { cn } from '@renderer/shared/lib'

const StepDots = ({ current, total }: { current: number; total: number }) => (
  <div className='flex items-center gap-[5px]'>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-[3px] rounded-[2px] transition-[width,background] duration-[250ms] ease-[ease]',
          i === current ? 'w-[20px] bg-accent' : i < current ? 'w-[12px] bg-neutral-600' : 'w-[12px] bg-neutral-800',
        )}
      />
    ))}
  </div>
)

export default StepDots
