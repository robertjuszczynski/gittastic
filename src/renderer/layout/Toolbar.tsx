import React from 'react';

type ToolbarProps = {
  children?: React.ReactNode;
};

const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <div className='flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-surface shrink-0'>
      {children}
    </div>
  );
};

export default Toolbar;
