import React from 'react'
import { Search, X } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className='shrink-0 flex items-center gap-2 mx-3 mt-3 mb-1 border border-black/[0.07] rounded px-2 py-1 focus-within:border-accent/50'>
    <Search size={12} className='shrink-0 text-neutral-500' />
    <input
      className='flex-1 min-w-0 bg-transparent text-[12px] text-neutral-200 placeholder-neutral-600 outline-none select-text'
      style={{ WebkitUserSelect: 'text' }}
      placeholder='Search files...'
      aria-label='Search files'
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {value && (
      <button
        type='button'
        onClick={() => onChange('')}
        className='shrink-0 text-neutral-500 hover:text-neutral-300'
        aria-label='Clear search'
      >
        <X size={12} />
      </button>
    )}
  </div>
)

export default SearchBar
