import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { FileChange } from '@shared'
import { ChevronDownIcon } from '@renderer/shared/ui/icons'
import { FolderIcon } from '@renderer/shared/ui/icons'
import ChangeItem from './ChangeItem'
import { StageCheckbox } from '@renderer/shared/ui'
import { useChangesStore, type FolderScope } from '@renderer/entities/git-file'

type TreeNode = {
  name: string
  fullPath: string
  children: TreeNode[]
  files: FileChange[]
}

function buildTree(files: FileChange[]): TreeNode {
  const root: TreeNode = { name: '', fullPath: '', children: [], files: [] }

  for (const file of files) {
    const parts = file.path.split('/')
    let current = root

    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i]
      let child = current.children.find(c => c.name === folderName)
      if (!child) {
        child = { name: folderName, fullPath: parts.slice(0, i + 1).join('/'), children: [], files: [] }
        current.children.push(child)
      }
      current = child
    }

    current.files.push(file)
  }

  return root
}

function getAllFilePaths(node: TreeNode): string[] {
  return [
    ...node.files.map(f => f.path),
    ...node.children.flatMap(getAllFilePaths),
  ]
}

type FolderNodeProps = {
  node: TreeNode
  depth: number
  isStaged?: boolean
  hash?: string
}

const FolderNode = ({ node, depth, isStaged, hash }: FolderNodeProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const selectedFolder = useChangesStore(s => s.selectedFolder)
  const setSelectedFolder = useChangesStore(s => s.setSelectedFolder)
  const stageFolder = useChangesStore(s => s.stageFolder)
  const unstageFolder = useChangesStore(s => s.unstageFolder)
  const unstaged = useChangesStore(s => s.unstaged)

  const allPaths = getAllFilePaths(node)
  const isSelected = selectedFolder === node.fullPath
  const isPartial = isStaged === true && allPaths.some(p => unstaged.some(f => f.path === p))

  const handleRowClick = () => {
    const scope: FolderScope = isStaged === true ? 'staged' : isStaged === false ? 'unstaged' : null
    setSelectedFolder(node.fullPath, hash, scope)
  }

  const handleCheckboxClick = () => {
    if (isStaged) {
      unstageFolder(node.fullPath)
    } else {
      stageFolder(node.fullPath)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1 cursor-pointer select-none h-[22px] ${isSelected ? 'bg-accent/6 text-accent' : 'hover:bg-surface-2'}`}
        style={{ paddingLeft: depth * 20 + 12 }}
        onClick={handleRowClick}
      >
        <motion.span
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.12 }}
          className='text-neutral-500 flex items-center'
          onClick={e => { e.stopPropagation(); setIsOpen(v => !v) }}
        >
          <ChevronDownIcon size={10} />
        </motion.span>
        {isStaged !== undefined ? (
          <StageCheckbox isStaged={!!isStaged} isPartial={isPartial} onClick={handleCheckboxClick} />
        ) : (
          <span className='text-neutral-400 flex items-center'>
            <FolderIcon open={isOpen} />
          </span>
        )}
        <span className={`text-[12px] ml-0.5 ${isSelected ? 'text-accent' : 'text-neutral-300'}`}>{node.name}</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className='overflow-hidden'
          >
            <TreeChildren node={node} depth={depth + 1} isStaged={isStaged} hash={hash} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type TreeChildrenProps = {
  node: TreeNode
  depth: number
  isStaged?: boolean
  hash?: string
}

const TreeChildren = ({ node, depth, isStaged, hash }: TreeChildrenProps) => (
  <>
    {node.files.map(file => (
      <ChangeItem key={file.path} change={file} isStaged={isStaged} depth={depth} hash={hash} />
    ))}
    {node.children.map(child => (
      <FolderNode key={child.fullPath} node={child} depth={depth} isStaged={isStaged} hash={hash} />
    ))}
  </>
)

type FileTreeProps = {
  files: FileChange[]
  isStaged?: boolean
  hash?: string
}

const FileTree = ({ files, isStaged, hash }: FileTreeProps) => {
  const tree = buildTree(files)
  return <TreeChildren node={tree} depth={0} isStaged={isStaged} hash={hash} />
}

export default FileTree
