import { createContext, useState, useContext, useCallback } from 'react';

export type BoxConfirmModalContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  showModal: (approveCallBack: () => void, rejectCallback: () => void) => void;
  onApprove: () => void;
  onReject: () => void;
} | null;

export const useBoxConfirmModalOrigin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [approveCallBack, setApproveCallBack] = useState<() => void>();
  const [rejectCallback, setRejectCallback] = useState<() => void>();

  const showModal = (approveCallBack: () => void, rejectCallback: () => void) => {
    setApproveCallBack(approveCallBack);
    setRejectCallback(rejectCallback);
    setIsOpen(true);
  };

  const onApprove = useCallback(() => {
    if (approveCallBack) {
      approveCallBack();
    }

    setIsOpen(false);
  }, []);

  const onReject = useCallback(() => {
    if (rejectCallback) {
      rejectCallback();
    }

    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    showModal,
    onApprove,
    onReject,
  };
};

export const BoxConfirmModalContext = createContext<BoxConfirmModalContextType>(null);
export const useBoxConfirmModal = () => useContext(BoxConfirmModalContext)!;
