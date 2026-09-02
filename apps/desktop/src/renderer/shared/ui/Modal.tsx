import ModalContext from './ModalContext';
import React, { useContext } from 'react';
import { motion } from 'motion/react';

type ModalProps = {
  component: React.ReactElement;
};

const Modal = ({ component }: ModalProps) => {
  if (!component) return null;

  const { toggleModal } = useContext(ModalContext);

  return (
    <motion.div
      key='modal-backdrop'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className='fixed inset-0 flex items-center justify-center bg-black/50'
      onClick={() => toggleModal(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 4 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className='w-[400px] rounded-xl border border-border bg-surface shadow-2xl shadow-black/40'
        onClick={e => e.stopPropagation()}
      >
        <div className='p-6'>
          {component}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Modal;
