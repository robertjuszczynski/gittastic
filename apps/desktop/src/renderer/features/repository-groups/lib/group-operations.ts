import { arrayMove } from '@dnd-kit/sortable'
import type { Repository, RepositoryGroups } from '@shared'

export const UNCATEGORIZED_ID = '__uncategorized__'

export function getUncategorizedRepos(repositories: Repository[], groups: RepositoryGroups): Repository[] {
  const assigned = new Set(groups.flatMap(g => g.repositoryPaths))
  return repositories.filter(r => !assigned.has(r.path))
}

export function reorderGroupRepos(
  groups: RepositoryGroups,
  groupId: string,
  oldIndex: number,
  newIndex: number
): RepositoryGroups {
  return groups.map(g => {
    if (g.id !== groupId) return g
    return { ...g, repositoryPaths: arrayMove(g.repositoryPaths, oldIndex, newIndex) }
  })
}

export function moveRepoBetweenGroups(
  groups: RepositoryGroups,
  repoPath: string,
  targetGroupId: string
): RepositoryGroups {
  const withoutRepo = groups.map(g => ({
    ...g,
    repositoryPaths: g.repositoryPaths.filter(p => p !== repoPath),
  }))

  if (targetGroupId === UNCATEGORIZED_ID) return withoutRepo

  return withoutRepo.map(g => {
    if (g.id !== targetGroupId) return g
    if (g.repositoryPaths.includes(repoPath)) return g
    return { ...g, repositoryPaths: [...g.repositoryPaths, repoPath] }
  })
}
