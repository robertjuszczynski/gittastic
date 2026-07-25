import React from 'react';

type SidebarProps = {
  children?: React.ReactNode;
};

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <aside className='w-[250px] shrink-0 h-screen overflow-y-auto flex flex-col border-r border-neutral-800 bg-surface'>
      {children}
    </aside>
  );
};

export default Sidebar;
