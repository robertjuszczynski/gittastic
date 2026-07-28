export type GitRawCommit = {
  hash: string;
  parents: string[];
  author_name: string;
  date: string;
  message: string;
}

export type GitRawCommits = GitRawCommit[]