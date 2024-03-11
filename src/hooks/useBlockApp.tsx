import React, { createContext, useState, useContext } from 'react';

export type BlockAppContextType = {
  isAppModifying: boolean;
  setIsAppModifying: (value: boolean) => void;
} | null;

export const useBlockAppOrigin = () => {
  const [isAppModifying, setIsAppModifying] = useState<boolean>(false);

  return {
    isAppModifying,
    setIsAppModifying,
  };
};

const BlockAppContext = createContext<BlockAppContextType>(null);

export const BlockAppProvider = ({ children, value }: { children: React.ReactNode; value: BlockAppContextType }) => {
  return <BlockAppContext.Provider value={value}>{children}</BlockAppContext.Provider>;
};

export const useBlockApp = () => useContext(BlockAppContext)!;
