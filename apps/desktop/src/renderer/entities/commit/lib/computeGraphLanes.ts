import type { GitRawCommit } from '@shared'

export type GraphSegment = {
  x1: number
  y1: 'top' | 'mid'
  x2: number
  y2: 'mid' | 'bot'
  color: string
}

export type CommitGraphRow = {
  commit: GitRawCommit
  lane: number
  color: string
  laneCount: number
  segments: GraphSegment[]
}

const COLORS = ['#00c8ff', '#7b6bff', '#ff4da6', '#00e5a0', '#ffc84d', '#ff6b6b']
const col = (i: number) => COLORS[i % COLORS.length]

export function computeGraphRows(commits: GitRawCommit[]): CommitGraphRow[] {
  let lanes: (string | undefined)[] = []
  const rows: CommitGraphRow[] = []

  for (const commit of commits) {
    const segments: GraphSegment[] = []

    // Find or assign commit's lane
    let commitLane = lanes.findIndex(h => h === commit.hash)
    const isNewLane = commitLane === -1
    if (isNewLane) {
      const free = lanes.findIndex(h => h === undefined)
      commitLane = free !== -1 ? free : lanes.length
      if (commitLane === lanes.length) lanes.push(undefined)
    }

    const incomingActive = lanes
      .map((h, i) => ({ lane: i, hash: h }))
      .filter((l): l is { lane: number; hash: string } => l.hash !== undefined)

    // TOP HALF: incoming lanes -> dot
    for (const { lane, hash } of incomingActive) {
      if (hash === commit.hash && lane !== commitLane) {
        // Merge from another lane → diagonal to commitLane
        segments.push({ x1: lane, y1: 'top', x2: commitLane, y2: 'mid', color: col(lane) })
      } else {
        // Straight vertical (commit's own lane or pass-through)
        segments.push({ x1: lane, y1: 'top', x2: lane, y2: 'mid', color: col(lane) })
      }
    }

    // Update lanes state
    lanes = lanes.map(h => (h === commit.hash ? undefined : h))
    lanes[commitLane] = commit.parents[0]

    const newParentLanes: number[] = []
    for (let p = 1; p < commit.parents.length; p++) {
      const ph = commit.parents[p]
      if (lanes.includes(ph)) continue
      const free = lanes.findIndex(h => h === undefined)
      const nl = free !== -1 ? free : lanes.length
      if (nl === lanes.length) lanes.push(undefined)
      lanes[nl] = ph
      newParentLanes.push(nl)
    }

    while (lanes.length > 0 && lanes[lanes.length - 1] === undefined) lanes.pop()

    const outgoingActive = lanes
      .map((h, i) => ({ lane: i, hash: h }))
      .filter((l): l is { lane: number; hash: string } => l.hash !== undefined)

    // BOTTOM HALF: dot → outgoing lanes
    for (const { lane } of outgoingActive) {
      if (newParentLanes.includes(lane)) {
        // New branch opens from commit → diagonal
        segments.push({ x1: commitLane, y1: 'mid', x2: lane, y2: 'bot', color: col(lane) })
      } else {
        // Straight vertical
        segments.push({ x1: lane, y1: 'mid', x2: lane, y2: 'bot', color: col(lane) })
      }
    }

    const laneCount = Math.max(
      commitLane + 1,
      ...incomingActive.map(l => l.lane + 1),
      ...outgoingActive.map(l => l.lane + 1),
      1
    )

    rows.push({ commit, lane: commitLane, color: col(commitLane), laneCount, segments })
  }

  return rows
}
