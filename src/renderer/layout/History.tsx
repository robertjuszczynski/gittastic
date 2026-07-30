import React from 'react';

type HistoryProps = {
  children?: React.ReactNode;
};

const History = ({ children }: HistoryProps) => {
  return (
    <div
      className='flex-1 overflow-y-auto flex flex-col bg-bg'
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </div>
  );
};

export default History;
