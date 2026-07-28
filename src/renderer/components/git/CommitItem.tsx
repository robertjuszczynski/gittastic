import React from 'react'
import { motion } from 'motion/react'
import type { CommitGraphRow, GraphSegment } from '@renderer/utils/computeGraphLanes'

const LANE_WIDTH = 20
const ROW_HEIGHT = 36

const laneX = (lane: number) => lane * LANE_WIDTH + LANE_WIDTH / 2
const segY = (pos: 'top' | 'mid' | 'bot') =>
  pos === 'top' ? 0 : pos === 'mid' ? ROW_HEIGHT / 2 : ROW_HEIGHT

function segmentPath(seg: GraphSegment): string {
  const x1 = laneX(seg.x1)
  const y1 = segY(seg.y1)
  const x2 = laneX(seg.x2)
  const y2 = segY(seg.y2)
  if (x1 === x2) return `M ${x1},${y1} L ${x1},${y2}`
  const my = (y1 + y2) / 2
  return `M ${x1},${y1} C ${x1},${my} ${x2},${my} ${x2},${y2}`
}

type CommitItemProps = {
  row: CommitGraphRow
  index: number
}

const CommitItem = ({ row, index }: CommitItemProps) => {
  const { commit, lane, color, laneCount, segments } = row
  const delay = index * 0.04
  const svgWidth = laneCount * LANE_WIDTH

  return (
    <div
      className='flex items-center border-b border-neutral-800 hover:bg-neutral-900 cursor-pointer'
      style={{ height: ROW_HEIGHT }}
    >
      <svg width={svgWidth} height={ROW_HEIGHT} className='shrink-0 overflow-visible'>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={segmentPath(seg)}
            stroke={seg.color}
            strokeWidth={1.5}
            fill='none'
          />
        ))}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformOrigin: `${laneX(lane)}px ${ROW_HEIGHT / 2}px` }}
          transition={{ duration: 0.2, delay: delay + 0.1, ease: 'backOut' }}
        >
          <circle cx={laneX(lane)} cy={ROW_HEIGHT / 2} r={5} fill='#161826' />
          <circle cx={laneX(lane)} cy={ROW_HEIGHT / 2} r={5} fill={color + '28'} stroke={color} strokeWidth={1.5} />
        </motion.g>
      </svg>

      <div className='flex items-center gap-4 px-4 flex-1 min-w-0'>
        <span className='text-[11px] font-mono text-neutral-500 shrink-0'>{commit.hash.slice(0, 7)}</span>
        <span className='text-[13px] text-neutral-100 flex-1 truncate'>{commit.message}</span>
        <span className='text-[11px] text-neutral-500 shrink-0'>{commit.author_name}</span>
        <span className='text-[11px] text-neutral-600 shrink-0'>{new Date(commit.date).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default CommitItem
