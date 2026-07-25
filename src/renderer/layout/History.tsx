import React from 'react';

type HistoryProps = {
  children?: React.ReactNode;
};

const History = ({ children }: HistoryProps) => {
  return (
    <div className='flex-1 overflow-y-auto flex flex-col bg-bg'>
      {children}
    </div>
  );
};

export default History;
