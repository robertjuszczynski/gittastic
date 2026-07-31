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
