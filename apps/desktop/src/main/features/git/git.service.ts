import type { SimpleGit } from 'simple-git'
import simpleGit from 'simple-git'
import { readFile, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { spawn } from 'child_process'
import { diffArrays, type ArrayChange } from 'diff'
import type { GitBranch, GitRawCommits, GitStash, FileChange, FileChangeStatus, FileDiff, GitUser, MergeStatus, MergeParticipants, ConflictFileContent } from '@shared'
import { splitLines } from '@main/utils'
import { createHash } from 'crypto'
import fs from 'node:fs'
import { NotInitializedError } from '@shared'
import { parseMergeMessage } from './lib/parseMergeMessage'

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'avif'])

const isImagePath = (path: string): boolean => {
  const ext = path.split('.').pop()?.toLowerCase()
  return ext ? IMAGE_EXTENSIONS.has(ext) : false
}

/** Catches non-image binaries (fonts, archives, ...) that `isImagePath` alone would miss. */
const isBinaryBuffer = (buffer: Buffer): boolean => buffer.subarray(0, 8000).includes(0)

const gitShowBinary = (repoPath: string, ref: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const proc = spawn('git', ['-C', repoPath, 'show', ref])
    proc.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
    proc.on('error', reject)
    proc.on('close', code => {
      if (code === 0) resolve(Buffer.concat(chunks))
      else reject(new Error(`git show exited with code ${code}`))
    })
  })
}

export const git = new Proxy({} as SimpleGit, {
    get: (_, prop) => GitService.getInstance()[prop as keyof SimpleGit]
})

export default class GitService {
  private static instance: SimpleGit | null = null
  public static basePath: string | null = null

  public static init(path: string): void {
    this.instance = simpleGit(path)
    this.basePath = path
  }

  public static getInstance(): SimpleGit {
    if (!this.instance) {
      throw new NotInitializedError('GitService not initialized. Call GitService.init(path) first.')
    }
    return this.instance
  }

  public static async hasGit(path: string): Promise<boolean> {
    try {
      await simpleGit(path).status()
      return true
    } catch {
      return false
    }
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }

  public static async getRawCommits(options?: { limit?: number; skip?: number }): Promise<GitRawCommits> {
    const args = ['log', '--branches', '--tags', '--pretty=format:%H|%P|%an|%ae|%aI|%s']
    if (options?.limit) args.push(`--max-count=${options.limit}`)
      if (options?.skip) args.push(`--skip=${options.skip}`)
        const raw = await git.raw(args)
      return raw.trim().split('\n').filter(Boolean).map(line => {
      const [hash, parents, author_name, author_email, date, ...messageParts] = line.split('|')
      const emailHash = createHash('md5').update(author_email.trim().toLowerCase()).digest('hex')
      return {
        hash,
        parents: parents ? parents.split(' ') : [],
        author_name,
        date,
        message: messageParts.join('|'),
        avatar_url: `https://www.gravatar.com/avatar/${emailHash}?s=32&d=404`,
      }
    })
  }

  public static async getBranches(): Promise<GitBranch[]> {
    const summary = await git.branch()
    return summary.all
      .filter(name => !name.startsWith('remotes/'))
      .map(name => ({ name, current: name === summary.current }))
  }

  public static async getStashes(): Promise<GitStash[]> {
    const list = await git.stashList()
    return list.all.map((entry, i) => ({
      index: i,
      message: entry.message,
    }))
  }

  public static async getUser(): Promise<GitUser> {
    const name = (await git.getConfig('user.name')).value ?? ''
    const email = (await git.getConfig('user.email')).value ?? ''
    return { name, email }
  }

  public static async setUser(name: string, email: string): Promise<void> {
    await simpleGit().addConfig('user.name', name, false, 'global')
    await simpleGit().addConfig('user.email', email, false, 'global')
  }

  public static async getCommitFiles(hash: string): Promise<FileChange[]> {
    const STATUS_MAP: Record<string, FileChangeStatus> = {
      M: 'modified', A: 'added', D: 'deleted', R: 'renamed',
    }
    const raw = await git.raw(['diff-tree', '--no-commit-id', '-r', '--name-status', hash])
    return raw.trim().split('\n').filter(Boolean).map(line => {
      const [status, ...paths] = line.split('\t')
      const code = status[0]
      return {
        path: paths[paths.length - 1],
        status: STATUS_MAP[code] ?? 'modified',
        oldPath: code === 'R' ? paths[0] : undefined,
      }
    })
  }


  public static async getFileDiff(path: string, hash?: string): Promise<FileDiff> {
    const repoRoot = (await git.revparse(['--show-toplevel'])).trim()

    if (isImagePath(path)) {
      if (hash) {
        const parentHash = `${hash}~1`
        let original = ''
        let modified = ''
        try { original = (await gitShowBinary(repoRoot, `${parentHash}:${path}`)).toString('base64') } catch { /* new file */ }
        try { modified = (await gitShowBinary(repoRoot, `${hash}:${path}`)).toString('base64') } catch { /* deleted file */ }
        return { original, modified }
      }

      let original = ''
      try { original = (await gitShowBinary(repoRoot, `HEAD:${path}`)).toString('base64') } catch { /* new file */ }

      let indexed = ''
      try { indexed = (await gitShowBinary(repoRoot, `:${path}`)).toString('base64') } catch { /* untracked file */ }

      let modified = ''
      try { modified = (await readFile(join(repoRoot, path))).toString('base64') } catch { /* deleted file */ }

      return { original, modified, indexed }
    }

    if (hash) {
      const parentHash = `${hash}~1`
      let original = ''
      let modified = ''
      try { original = await git.show([`${parentHash}:${path}`]) } catch { /* new file */ }
      try { modified = await git.show([`${hash}:${path}`]) } catch { /* deleted file */ }
      return { original, modified }
    }

    let original = ''
    try { original = await git.show([`HEAD:${path}`]) } catch { /* new file */ }

    let indexed = ''
    try { indexed = await git.show([`:${path}`]) } catch { /* untracked file */ }

    let modified = ''
    try { modified = await readFile(join(repoRoot, path), 'utf-8') } catch { /* deleted file */ }

    return { original, modified, indexed }
  }

  public static async setLineStagedState(path: string, lineNumber: number, isAddition: boolean, stage: boolean): Promise<void> {
    const { head, index, wt } = await this.getThreeVersions(git, path)
    const headLines = splitLines(head)
    const indexLines = splitLines(index)
    const wtLines = splitLines(wt)

    const headToWt = diffArrays(headLines, wtLines)
    const staged = this.getStagedState(headLines, indexLines, headToWt, wtLines)

    const set = isAddition ? staged.additions : staged.removals
    if (stage) set.add(lineNumber)
    else set.delete(lineNumber)

    const { lines: newIndex, lastSource, isLastOfSource } = this.reconstructIndex(headToWt, staged)

    const trailing = this.getTrailingNewline(newIndex, lastSource, isLastOfSource, head, wt)
    await this.writeToIndex(git, path, newIndex.join('\n') + trailing)
  }

  private static getStagedState(
    headLines: string[],
    indexLines: string[],
    headToWt: ArrayChange<string>[],
    wtLines: string[],
  ): { additions: Set<number>; removals: Set<number> } {
    const additions = new Set<number>()
    const removals = new Set<number>()

    const stagedWtPositions = new Set<number>()
    let wtPos = 0
    for (const part of diffArrays(indexLines, wtLines)) {
      if (part.added) {
        wtPos += part.count!
      } else if (!part.removed) {
        for (let i = 0; i < part.count!; i++) stagedWtPositions.add(++wtPos)
      }
    }

    const stagedHeadRemovals = new Set<number>()
    let headPos = 0
    for (const part of diffArrays(headLines, indexLines)) {
      if (part.removed) {
        for (let i = 0; i < part.count!; i++) stagedHeadRemovals.add(++headPos)
      } else if (!part.added) {
        headPos += part.count!
      }
    }

    headPos = 0
    wtPos = 0
    for (const part of headToWt) {
      if (part.removed) {
        for (let i = 0; i < part.count!; i++) {
          headPos++
          if (stagedHeadRemovals.has(headPos)) removals.add(headPos)
        }
      } else if (part.added) {
        for (let i = 0; i < part.count!; i++) {
          wtPos++
          if (stagedWtPositions.has(wtPos)) additions.add(wtPos)
        }
      } else {
        headPos += part.count!
        wtPos += part.count!
      }
    }

    return { additions, removals }
  }

  private static reconstructIndex(
    headToWt: ArrayChange<string>[],
    staged: { additions: Set<number>; removals: Set<number> },
  ): { lines: string[]; lastSource: 'wt' | 'head' | 'none'; isLastOfSource: boolean } {
    const lines: string[] = []
    let headPos = 0
    let wtPos = 0
    let lastSource: 'wt' | 'head' | 'none' = 'none'
    let lastSourcePos = 0

    for (const part of headToWt) {
      if (part.removed) {
        for (let i = 0; i < part.count!; i++) {
          headPos++
          if (!staged.removals.has(headPos)) {
            lines.push(part.value[i])
            lastSource = 'head'
            lastSourcePos = headPos
          }
        }
      } else if (part.added) {
        for (let i = 0; i < part.count!; i++) {
          wtPos++
          if (staged.additions.has(wtPos)) {
            lines.push(part.value[i])
            lastSource = 'wt'
            lastSourcePos = wtPos
          }
        }
      } else {
        for (let i = 0; i < part.count!; i++) {
          headPos++
          wtPos++
          lines.push(part.value[i])
          lastSource = 'wt'
          lastSourcePos = wtPos
        }
      }
    }

    const totalForSource = lastSource === 'head' ? headPos : wtPos
    return { lines, lastSource, isLastOfSource: lastSourcePos === totalForSource }
  }

  private static getTrailingNewline(
    lines: string[],
    lastSource: 'wt' | 'head' | 'none',
    isLastOfSource: boolean,
    head: string,
    wt: string,
  ): string {
    if (lines.length === 0) return ''
    if (!isLastOfSource) return '\n'
    const source = lastSource === 'head' ? head : wt
    return source.endsWith('\n') ? '\n' : ''
  }

  private static async getThreeVersions(git: SimpleGit, path: string) {
    const repoRoot = (await git.revparse(['--show-toplevel'])).trim()
    const [head, index, wt] = await Promise.all([
      git.show([`HEAD:${path}`]).catch(() => ''),
      git.show([`:${path}`]).catch(() => ''),
      readFile(join(repoRoot, path), 'utf-8').catch(() => ''),
    ])
    return { head, index, wt }
  }

  private static async writeToIndex(git: SimpleGit, path: string, content: string): Promise<void> {
    const tmpPath = join(tmpdir(), `gitastic-${Date.now()}.tmp`)
    await writeFile(tmpPath, content, 'utf-8')
    try {
      const hash = (await git.raw(['hash-object', '-w', tmpPath])).trim()
      await git.raw(['update-index', '--cacheinfo', `100644,${hash},${path}`])
    } finally {
      await unlink(tmpPath).catch(() => {})
    }
  }

  public static async stageAll(): Promise<void> {
    await git.add('-A')
  }

  public static async unstageAll(): Promise<void> {
    try {
      await git.reset(['HEAD'])
    } catch {
      await git.reset()
    }
  }

  public static async commit(message: string, description?: string): Promise<{ hash: string; branch: string }> {
    const fullMessage = description ? `${message}\n\n${description}` : message
    await git.commit(fullMessage)
    const [hash, branch] = await Promise.all([
      git.revparse(['HEAD']),
      git.revparse(['--abbrev-ref', 'HEAD']),
    ])
    return { hash: hash.trim(), branch: branch.trim() }
  }

  public static async stageFile(path: string): Promise<void> {
    await git.add(path)
  }

  public static async unstageFile(path: string): Promise<void> {
    await git.reset(['--', path])
  }

  public static async discardFile(path: string): Promise<void> {
    await git.checkout(['--', path])
  }

  public static async stageFolder(path: string): Promise<void> {
    await git.add(path)
  }

  public static async unstageFolder(path: string): Promise<void> {
    await git.reset(['--', path])
  }

  public static async stash(): Promise<boolean> {
    const status = await git.status()
    if (status.files.length === 0) {
      return false
    }

    await git.stash(['push', '--include-untracked'])
    return true
  }

  public static async popStash(): Promise<void> {
    await git.stash(['pop'])
  }

  public static async undo(expectedHeadHash: string): Promise<{ resultingHeadHash: string }> {
    const currentHeadHash = (await git.revparse(['HEAD'])).trim()
    if (currentHeadHash !== expectedHeadHash) {
      throw new Error('HEAD has moved since this commit - cannot undo safely')
    }

    const parents = (await git.raw(['rev-list', '--parents', '-n', '1', 'HEAD'])).trim().split(' ')
    if (parents.length - 1 > 1) {
      throw new Error('Cannot undo a merge commit — it has more than one parent')
    }

    await git.reset(['--soft', 'HEAD~1'])
    const resultingHeadHash = (await git.revparse(['HEAD'])).trim()
    return { resultingHeadHash }
  }

  public static async redo(expectedHeadHash: string, targetHash: string): Promise<void> {
    const currentHeadHash = (await git.revparse(['HEAD'])).trim()
    if (currentHeadHash !== expectedHeadHash) {
      throw new Error('HEAD has moved since this undo — cannot redo safely')
    }

    await git.reset(['--soft', targetHash])
  }

  public static async checkoutBranch(name: string): Promise<void> {
    await git.checkout(name)
  }

  public static async createBranch(name: string): Promise<void> {
    await git.checkoutLocalBranch(name)
  }

  public static async deleteBranch(name: string): Promise<void> {
    await git.deleteLocalBranch(name, true)
  }

  public static async removeUntrackedFile(absolutePath: string): Promise<void> {
    fs.unlink(absolutePath, () => {})
  }

  private static async getMergeHeadHash(): Promise<string | null> {
    if (!this.basePath) return null
    try {
      return (await readFile(join(this.basePath, '.git', 'MERGE_HEAD'), 'utf-8')).trim()
    } catch {
      return null
    }
  }

  private static async getMergeMessage(): Promise<string | null> {
    if (!this.basePath) return null
    try {
      return await readFile(join(this.basePath, '.git', 'MERGE_MSG'), 'utf-8')
    } catch {
      return null
    }
  }

  /**
   * Figures out which branches sit on each side of the in-progress merge,
   * for display in the merge status banner ("merge feature-b into feature-a").
   * "theirs" falls back to a short hash when `name-rev` can't resolve a
   * branch name (e.g. merging a bare commit).
   */
  public static async getMergeParticipants(mergeHeadHash: string, status: Awaited<ReturnType<SimpleGit['status']>>): Promise<MergeParticipants> {
    const ours = status.current ?? 'HEAD'

    let theirs = mergeHeadHash.slice(0, 7)
    try {
      const nameRev = (await git.raw(['name-rev', '--name-only', mergeHeadHash])).trim()
      if (nameRev && nameRev !== 'undefined') {
        theirs = nameRev.replace(/^remotes\/origin\//, '').replace(/[~^].*$/, '')
      }
    } catch { /* fall back to the short hash */ }

    return { ours, theirs }
  }

  public static async getMergeStatus(): Promise<MergeStatus> {
    const mergeHeadHash = await this.getMergeHeadHash()
    if (!mergeHeadHash) {
      return { inProgress: false, conflictedFiles: [], message: null, participants: null }
    }

    const status = await git.status()
    const rawMessage = await this.getMergeMessage()
    const message = rawMessage ? parseMergeMessage(rawMessage) : null
    const participants = await this.getMergeParticipants(mergeHeadHash, status)

    return { inProgress: true, conflictedFiles: status.conflicted, message, participants }
  }

  public static async mergeBranch(branchName: string): Promise<{ hasConflicts: boolean }> {
    try {
      await git.merge([branchName])
      return { hasConflicts: false }
    } catch (error) {
      const status = await git.status()
      if (status.conflicted.length > 0) return { hasConflicts: true }
      throw error
    }
  }

  public static async abortMerge(): Promise<void> {
    await git.raw(['merge', '--abort'])
  }

  public static async getConflictFileContent(path: string): Promise<ConflictFileContent> {
    const repoRoot = (await git.revparse(['--show-toplevel'])).trim()

    let oursDeleted = false
    let theirsDeleted = false
    try { await git.show([`:2:${path}`]) } catch { oursDeleted = true }
    try { await git.show([`:3:${path}`]) } catch { theirsDeleted = true }
    const isDeleteConflict = oursDeleted || theirsDeleted

    // Nothing to diff for a delete/modify conflict, the working-tree file
    // is just whichever side kept it, with no markers. DeleteModifyConflictPicker
    // only needs the flags above, not the content.
    if (isDeleteConflict) {
      return { isBinary: false, isDeleteConflict, oursDeleted, theirsDeleted, raw: '', oursBinary: '', theirsBinary: '' }
    }

    let rawBuffer: Buffer | null = null
    try { rawBuffer = await readFile(join(repoRoot, path)) } catch { /* unexpected — file should exist when neither side deleted it */ }

    const isBinary = isImagePath(path) || (rawBuffer !== null && isBinaryBuffer(rawBuffer))

    if (isBinary) {
      let oursBinary = ''
      let theirsBinary = ''
      try { oursBinary = (await gitShowBinary(repoRoot, `:2:${path}`)).toString('base64') } catch { /* deleted in ours */ }
      try { theirsBinary = (await gitShowBinary(repoRoot, `:3:${path}`)).toString('base64') } catch { /* deleted in theirs */ }
      return { isBinary, isDeleteConflict, oursDeleted, theirsDeleted, raw: '', oursBinary, theirsBinary }
    }

    const raw = rawBuffer ? rawBuffer.toString('utf-8') : ''
    return { isBinary, isDeleteConflict, oursDeleted, theirsDeleted, raw, oursBinary: '', theirsBinary: '' }
  }

  public static async resolveConflictFile(path: string, content: string): Promise<void> {
    const repoRoot = (await git.revparse(['--show-toplevel'])).trim()
    await writeFile(join(repoRoot, path), content, 'utf-8')
    await git.add([path])
  }

  /** Resolves a conflicted file by taking one side wholesale */
  public static async resolveConflictSide(path: string, side: 'ours' | 'theirs'): Promise<void> {
    const repoRoot = (await git.revparse(['--show-toplevel'])).trim()
    const stage = side === 'ours' ? 2 : 3
    const buffer = await gitShowBinary(repoRoot, `:${stage}:${path}`)
    await writeFile(join(repoRoot, path), buffer)
    await git.add([path])
  }

  public static async removeConflictFile(path: string): Promise<void> {
    await git.rm([path])
  }
}
