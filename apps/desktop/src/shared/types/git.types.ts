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
