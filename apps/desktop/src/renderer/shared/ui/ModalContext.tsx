import Modal from './Modal'
import React, { createContext, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { ReactElement } from 'react'

type ModalContextType = {
  isModalOpen: boolean
  toggleModal: (content: ReactElement | null) => void
}

type ModalProviderProps = {
  children: ReactElement
}

const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  toggleModal: () => {},
})

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [content, setContent] = useState<ReactElement | null>(null)

  useEffect(() => {
    if (!isModalOpen) {
      setContent(null)
    }
  }, [isModalOpen])

  const toggleModal = (content: ReactElement | null) => {
    setContent(content)
    setModalOpen((prev) => !prev)
  }

  return (
    <ModalContext.Provider value={{ isModalOpen, toggleModal }}>
      {children}
      <AnimatePresence>
        {isModalOpen && content && <Modal component={content} />}
      </AnimatePresence>
    </ModalContext.Provider>
  )
}

export default ModalContext
