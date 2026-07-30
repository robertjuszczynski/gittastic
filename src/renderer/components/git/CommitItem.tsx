import React from 'react'
import { motion } from 'motion/react'
import type { CommitGraphRow, GraphSegment } from '@renderer/utils/computeGraphLanes'

const LANE_WIDTH = 12
const ROW_HEIGHT = 25
const DOT = 3

const TYPE_COLORS: Record<string, `#${string}`> = {
  feat:     '#1b70f8',
  fix:      '#e53e3e',
  chore:    '#8e93a8',
  docs:     '#6b48ff',
  refactor: '#d97706',
  style:    '#db2777',
  test:     '#059669',
  perf:     '#ea580c',
  ci:       '#7c3aed',
  build:    '#64748b',
  revert:   '#e53e3e',
}

function parseCommit(message: string) {
  const match = message.match(/^(\w+)(\([^)]+\))?!?: (.+)/)
  if (match) return { type: match[1].toLowerCase(), rest: match[3] }
  return { type: null, rest: message }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = d.toLocaleDateString('en', { month: 'short' })
  const year = String(d.getFullYear()).slice(2)
  return `${day} ${month} '${year}`
}

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
  const delay = index * 0.012
  const svgWidth = laneCount * LANE_WIDTH
  const cx = laneX(lane)
  const cy = ROW_HEIGHT / 2

  const { type, rest } = parseCommit(commit.message)
  const typeColor = type ? (TYPE_COLORS[type] ?? '#8e93a8') : null
  const firstName = commit.author_name.split(' ')[0]


  return (
    <div
      className='flex items-center hover:bg-surface cursor-pointer'
      style={{ height: ROW_HEIGHT, borderBottom: '1px solid rgba(0,0,0,0.05)' }}
    >
      <svg width={svgWidth} height={ROW_HEIGHT} className='shrink-0 overflow-visible'>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={segmentPath(seg)}
            stroke={seg.color}
            strokeWidth={1}
            strokeOpacity={0.6}
            fill='none'
          />
        ))}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          transition={{ duration: 0.12, delay: delay + 0.04, ease: 'backOut' }}
        >
          <circle cx={cx} cy={cy} r={DOT} fill='#ffffff' stroke={color} strokeWidth={1.5} />
        </motion.g>
      </svg>

      <div className='flex items-center gap-2 px-2 flex-1 min-w-0 overflow-hidden'>
        {type && typeColor && (
          <span className='shrink-0 text-[12px] font-bold font-mono' style={{ color: typeColor }}>
            {type}
          </span>
        )}

        <span className='text-[12px] text-neutral-200 flex-1 truncate min-w-0'>{rest}</span>


        <span className='text-[12px] text-neutral-500 shrink-0 max-w-15 truncate'>{firstName}</span>
        <span className='text-[12px] font-mono text-neutral-600 shrink-0 tabular-nums'>{commit.hash.slice(0, 7)}</span>
        <span className='text-[12px] text-neutral-600 shrink-0 tabular-nums'>{formatDate(commit.date)}</span>
      </div>
    </div>
  )
}

export default CommitItem
