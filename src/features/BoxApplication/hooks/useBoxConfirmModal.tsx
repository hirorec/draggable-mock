import { createContext, useState, useContext } from 'react';

export type BoxConfirmModalContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
} | null;

export const useBoxConfirmModalOrigin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
  };
};

export const BoxConfirmModalContext = createContext<BoxConfirmModalContextType>(null);
export const useBoxConfirmModal = () => useContext(BoxConfirmModalContext)!;
