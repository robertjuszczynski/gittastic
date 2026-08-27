type ImageDiffViewProps = {
  oldValue: string
  newValue: string
  mime: string
}

const NoPreview = () => (
  <div className='text-neutral-500 text-[12px] px-3 py-2'>Preview not available</div>
)

const ImageDiffView = ({ oldValue, newValue, mime }: ImageDiffViewProps) => {
  if (!mime) return <NoPreview />

  return (
    <div className='flex-1 flex items-center justify-center p-8'>
      <div className='flex flex-col items-center gap-4'>
        {oldValue ? (
          <img src={`data:${mime};base64,${oldValue}`} alt="old" className='max-w-sm max-h-80 object-contain' />
        ) : (
          <span className='text-neutral-500 text-[12px]'>No previous version</span>
        )}
        {newValue && (
          <>
            <span className='text-neutral-400 text-lg'>↓</span>
            <img src={`data:${mime};base64,${newValue}`} alt="new" className='max-w-sm max-h-80 object-contain' />
          </>
        )}
      </div>
    </div>
  )
}

export default ImageDiffView
