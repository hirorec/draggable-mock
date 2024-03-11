import React, { createContext, useState, useContext, useEffect } from 'react';

export type BlockAppContextType = {
  isAppModifying: boolean;
  isWindowMouseDown: boolean;
  setIsAppModifying: (value: boolean) => void;
} | null;

export const useBlockAppOrigin = () => {
  const [isAppModifying, setIsAppModifying] = useState<boolean>(false);
  const [isWindowMouseDown, setIsWindowMouseDown] = useState<boolean>(false);

  useEffect(() => {
    const onWindowMouseDown = () => {
      setIsWindowMouseDown(true);
    };

    const onWindowMouseUp = () => {
      setIsWindowMouseDown(false);
    };

    window.addEventListener('mousedown', onWindowMouseDown);
    window.addEventListener('mouseup', onWindowMouseUp);

    return () => {
      window.removeEventListener('mousedown', onWindowMouseDown);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, []);

  return {
    isAppModifying,
    isWindowMouseDown,
    setIsAppModifying,
  };
};

const BlockAppContext = createContext<BlockAppContextType>(null);

export const BlockAppProvider = ({ children, value }: { children: React.ReactNode; value: BlockAppContextType }) => {
  return <BlockAppContext.Provider value={value}>{children}</BlockAppContext.Provider>;
};

export const useBlockApp = () => useContext(BlockAppContext)!;
