import React from 'react';

import { BoxAppContextType, BoxAppContext } from '../hooks/useBoxApp';
import { BoxConfirmModalContextType, BoxConfirmModalContext } from '../hooks/useBoxConfirmModal';

export const BoxAppProvider = ({ children, value }: { children: React.ReactNode; value: BoxAppContextType }) => {
  return <BoxAppContext.Provider value={value}>{children}</BoxAppContext.Provider>;
};

export const BoxConfirmModalProvider = ({ children, value }: { children: React.ReactNode; value: BoxConfirmModalContextType }) => {
  return <BoxConfirmModalContext.Provider value={value}>{children}</BoxConfirmModalContext.Provider>;
};
