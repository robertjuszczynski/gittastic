export type GitRawCommit = {
  hash: string;
  parents: string[];
  author_name: string;
  date: string;
  message: string;
}

export type GitRawCommits = GitRawCommit[]

export type GitBranch = {
  name: string;
  current: boolean;
}

export type GitStash = {
  index: number;
  message: string;
}

export type GitUser = {
  name: string
  email: string
}

export type FileChangeStatus = 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked' | 'conflicted'

export type FileChange = {
  path: string;
  status: FileChangeStatus;
  oldPath?: string;
}

export type FileDiff = {
  original: string;
  modified: string;
  indexed?: string;
}

export type MergeParticipants = {
  ours: string;
  theirs: string;
}

export type MergeMessage = {
  title: string;
  description: string;
}

export type MergeStatus = {
  inProgress: boolean;
  conflictedFiles: string[];
  message: MergeMessage | null;
  participants: MergeParticipants | null;
}

export type ConflictFileContent = {
  isBinary: boolean;
  /** One side deleted the file, the other modified it — no conflict markers to show, just a keep/delete choice. */
  isDeleteConflict: boolean;
  oursDeleted: boolean;
  theirsDeleted: boolean;
  /** Working-tree file content, conflict markers included. Empty for binary/delete conflicts. */
  raw: string;
  /** base64, only populated for binary conflicts. */
  oursBinary: string;
  theirsBinary: string;
}
