// TODO: Refactor

export type ConflictHunk = {
  index: number
  oursLines: string[]
  theirsLines: string[]
  oursLabel: string
  theirsLabel: string
}

export type ConflictSegment =
  | { type: 'context'; lines: string[] }
  | { type: 'conflict'; hunk: ConflictHunk }

/**
 * Parses a working-tree file's conflict markers (`<<<<<<<` / `=======` /
 * `>>>>>>>`) into an ordered list of context and conflict segments.
 *
 * Assumes the default 2-way marker style. Repos with `merge.conflictStyle =
 * diff3` also get a `|||||||` base section between ours and the separator —
 * unsupported here; it gets absorbed into `oursLines` verbatim.
 */
export function parseConflictMarkers(raw: string): ConflictSegment[] {
  const lines = raw.split('\n')
  const segments: ConflictSegment[] = []
  let context: string[] = []
  let hunkIndex = 0
  let i = 0

  const flushContext = () => {
    if (context.length) {
      segments.push({ type: 'context', lines: context })
      context = []
    }
  }

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('<<<<<<<')) {
      const oursLabel = line.slice('<<<<<<<'.length).trim()
      const oursLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('=======')) {
        oursLines.push(lines[i])
        i++
      }
      i++ // skip the '=======' separator

      const theirsLines: string[] = []
      while (i < lines.length && !lines[i].startsWith('>>>>>>>')) {
        theirsLines.push(lines[i])
        i++
      }
      const theirsLabel = (lines[i] ?? '').slice('>>>>>>>'.length).trim()
      i++ // skip the '>>>>>>>' marker

      flushContext()
      segments.push({ type: 'conflict', hunk: { index: hunkIndex++, oursLines, theirsLines, oursLabel, theirsLabel } })
      continue
    }

    context.push(line)
    i++
  }
  flushContext()

  return segments
}

export function countConflictHunks(raw: string): number {
  return parseConflictMarkers(raw).filter(s => s.type === 'conflict').length
}

export const renderHunkMarkers = (hunk: ConflictHunk): string[] => [
  `<<<<<<< ${hunk.oursLabel}`,
  ...hunk.oursLines,
  '=======',
  ...hunk.theirsLines,
  `>>>>>>> ${hunk.theirsLabel}`,
]

/** Per-line ours/theirs picks for one hunk — the source of truth for both the per-line checkboxes and the bulk Accept Ours/Theirs/Both buttons (which just set every index on one or both sides). */
export type HunkLineSelection = { ours: Set<number>; theirs: Set<number> }

export const selectAllOurs = (hunk: ConflictHunk): HunkLineSelection => ({
  ours: new Set(hunk.oursLines.map((_, i) => i)),
  theirs: new Set(),
})

export const selectAllTheirs = (hunk: ConflictHunk): HunkLineSelection => ({
  ours: new Set(),
  theirs: new Set(hunk.theirsLines.map((_, i) => i)),
})

export const selectAllBoth = (hunk: ConflictHunk): HunkLineSelection => ({
  ours: new Set(hunk.oursLines.map((_, i) => i)),
  theirs: new Set(hunk.theirsLines.map((_, i) => i)),
})

/** Renders a line selection down to the text that goes into the merged result — picked ours lines first (in their original order), then picked theirs lines. */
export function renderSelection(hunk: ConflictHunk, selection: HunkLineSelection): string {
  const oursPicked = hunk.oursLines.filter((_, i) => selection.ours.has(i))
  const theirsPicked = hunk.theirsLines.filter((_, i) => selection.theirs.has(i))
  return [...oursPicked, ...theirsPicked].join('\n')
}

/**
 * Finds where a specific hunk's *current* text currently sits in
 * `mergedText`, so it can be replaced with something else (a new selection,
 * or the original markers on revert).
 *
 * `currentTextForHunk` reports what a hunk currently looks like in the
 * document — raw markers if it's still pending, or whatever text was last
 * written in for it if it's been resolved. Two hunks can report
 * byte-identical text (same branch labels, same conflicting lines
 * duplicated elsewhere) — a plain `text.indexOf(...)` or `.replace()` would
 * always hit the first occurrence, silently touching the wrong hunk.
 * Instead this walks every hunk in document order, advancing a search
 * cursor past each one it finds, so a later hunk's identical text is
 * matched at its own position. Returns -1 if the target hunk's current text
 * isn't present verbatim (hand-edited away).
 */
export function locateHunkTextIndex(
  mergedText: string,
  hunksInDocumentOrder: ConflictHunk[],
  targetHunkIndex: number,
  currentTextForHunk: (hunk: ConflictHunk) => string,
): number {
  let searchFrom = 0

  for (const hunk of hunksInDocumentOrder) {
    const block = currentTextForHunk(hunk)
    const idx = mergedText.indexOf(block, searchFrom)

    if (hunk.index === targetHunkIndex) return idx
    if (idx !== -1) searchFrom = idx + block.length
  }

  return -1
}

/** Which lines are currently picked for every hunk that's been touched — absent entries are still pending (raw markers). */
export type HunkSelectionMap = Record<number, HunkLineSelection>

const currentHunkText = (hunk: ConflictHunk, selection: HunkSelectionMap): string => {
  const picked = selection[hunk.index]
  return picked ? renderSelection(hunk, picked) : renderHunkMarkers(hunk).join('\n')
}

/**
 * Applies a new line selection for one hunk — or `undefined` to revert it
 * back to raw markers — against the live merged text + selection map.
 * Returns the updated pair, or `null` if that hunk's current text can no
 * longer be found verbatim (edited by hand outside the selection UI, so
 * there's nothing safe to replace).
 *
 * This is the single path every mutation goes through — a per-line toggle,
 * a bulk Accept Ours/Theirs/Both, a whole-file "Use Ours", and a Revert are
 * all just different `nextSelection` values run through the same locate +
 * splice, so they can never disagree about where a hunk lives in the text.
 */
export function resolveHunkInText(
  mergedText: string,
  selection: HunkSelectionMap,
  hunksInDocumentOrder: ConflictHunk[],
  targetHunkIndex: number,
  nextSelection: HunkLineSelection | undefined,
): { mergedText: string; selection: HunkSelectionMap } | null {
  const hunk = hunksInDocumentOrder.find(h => h.index === targetHunkIndex)
  if (!hunk) return null

  const idx = locateHunkTextIndex(mergedText, hunksInDocumentOrder, targetHunkIndex, h => currentHunkText(h, selection))
  if (idx === -1) return null

  const oldText = currentHunkText(hunk, selection)
  const newText = nextSelection ? renderSelection(hunk, nextSelection) : renderHunkMarkers(hunk).join('\n')

  const nextSelectionMap = { ...selection }
  if (nextSelection) nextSelectionMap[targetHunkIndex] = nextSelection
  else delete nextSelectionMap[targetHunkIndex]

  return {
    mergedText: mergedText.slice(0, idx) + newText + mergedText.slice(idx + oldText.length),
    selection: nextSelectionMap,
  }
}

/**
 * Determines whether an individual conflict hunk is still "pending" in the
 * live, possibly hand-edited merged text, or has been "resolved" — drives
 * the resolved/pending indicator next to each hunk in the conflict navigator.
 *
 * This is fuzzy by nature: once a hunk's markers are replaced by
 * `resolveHunkInText` (or hand-edited away), there's no direct pointer
 * back from the edited text to "hunk #3" anymore — the markers are gone.
 *
 * A hunk is unambiguously "pending" if its exact marker block
 * (`<<<<<<< ...` through `>>>>>>> ...`) still appears verbatim in
 * `currentContent`. Once the markers are gone, it only counts as "resolved"
 * if something actually took their place — plain deletion (the edited text
 * equals the original file with the marker block cut out and nothing put
 * back) still reads as pending, so selecting the whole block and hitting
 * backspace doesn't get counted as a resolution.
 */
export function computeHunkResolutionState(
  hunk: ConflictHunk,
  currentContent: string,
  rawContent: string,
): 'pending' | 'resolved' {
  const markerBlock = renderHunkMarkers(hunk).join('\n')
  if (currentContent.includes(markerBlock)) return 'pending'

  const emptiedOut = currentContent === rawContent.replace(markerBlock, '')
  return emptiedOut ? 'pending' : 'resolved'
}
