import React from 'react';

import { BoxAppContextType, BoxAppContext } from '../hooks/useBoxApp';

export const BoxAppProvider = ({ children, value }: { children: React.ReactNode; value: BoxAppContextType }) => {
  return <BoxAppContext.Provider value={value}>{children}</BoxAppContext.Provider>;
};
