import { createContext, useState, useContext } from 'react';

export type BoxConfirmModalContextType = {
  isOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
} | null;

export type ModalConfig = {
  onClose: () => void;
};

export const useBoxConfirmModalOrigin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>();

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    showModal,
    hideModal,
  };
};

export const BoxConfirmModalContext = createContext<BoxConfirmModalContextType>(null);
export const useBoxConfirmModal = () => useContext(BoxConfirmModalContext)!;
