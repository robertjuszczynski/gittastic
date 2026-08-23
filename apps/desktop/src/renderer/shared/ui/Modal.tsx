import ModalContext from './ModalContext';
import React, { useContext } from 'react';

type ModalProps = {
  component: React.ReactElement;
};

const Modal = ({ component }: ModalProps) => {
  if (!component) return null;

  const { toggleModal } = useContext(ModalContext);
  
  function handleClickOutside(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    toggleModal(null);
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm' onClick={handleClickOutside}>
      <div className='relative w-480 rounded-2xl border border-white/6 bg-slate-900 shadow-2xl shadow-black/60'>
        <div className='absolute inset-0 rounded-2xl bg-linear-to-br from-white/4 via-transparent to-transparent pointer-events-none' />
        <div className='relative z-10 p-8'>
          {component}
        </div>
      </div>
    </div>
  );
}

export default Modal;
