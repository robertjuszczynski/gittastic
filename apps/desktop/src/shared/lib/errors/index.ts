export class NotInitializedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Resource not initialized')
    this.name = 'NotInitializedError'
  }
}

export class NotGitRepositoryError extends Error {
  constructor(message?: string) {
    super(message ?? 'Not a git repository')
    this.name = 'NotGitRepositoryError'
  }
}

export class ParseError extends Error {
  constructor(message?: string) {
    super(message ?? 'Failed to parse')
    this.name = 'ParseError'
  }
}
